/**
 * OAuth2 Configuration for Google and GitHub
 * 
 * This file contains OAuth2 provider configurations and helper functions
 * to construct authorization URLs for frontend-initiated OAuth flows.
 */

export interface OAuth2Provider {
    clientId: string;
    clientSecret?: string; // WARNING: Exposing this in frontend is a security risk!
    authorizationEndpoint: string;
    tokenEndpoint?: string;
    scopes: string[];
    redirectUri: string;
}

export interface OAuth2Config {
    google: OAuth2Provider;
    github: OAuth2Provider;
}

// Get the current origin for redirect URI
const getRedirectUri = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth/callback`;
    }
    return 'http://localhost:8081/auth/callback';
};

/**
 * OAuth2 Provider Configurations
 */
export const oauth2Config: OAuth2Config = {
    google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '146174992410-1fe43os7hj3dic3lgn0jo1gv99dhr5jo.apps.googleusercontent.com',
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, // WARNING: Security risk!
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        scopes: ['openid', 'email', 'profile'],
        redirectUri: getRedirectUri(),
    },
    github: {
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        scopes: ['read:user', 'user:email'],
        redirectUri: getRedirectUri(),
    },
};

/**
 * Generate a random state parameter for CSRF protection
 */
export const generateState = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store state parameter in sessionStorage for validation
 */
export const storeState = (state: string): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('oauth_state', state);
    }
};

/**
 * Retrieve and validate state parameter
 */
export const validateState = (state: string): boolean => {
    if (typeof window !== 'undefined') {
        const storedState = sessionStorage.getItem('oauth_state');
        sessionStorage.removeItem('oauth_state');
        return storedState === state;
    }
    return false;
};

/**
 * Build OAuth2 authorization URL
 * 
 * @param provider - OAuth provider slug ('google' or 'github')
 * @param context - Context for the OAuth flow ('login' or 'register')
 * @returns Complete authorization URL
 */
export const buildOAuthUrl = (
    provider: 'google' | 'github',
    context: 'login' | 'register' = 'login'
): string => {
    const config = oauth2Config[provider];

    if (!config.clientId) {
        throw new Error(`OAuth client ID not configured for ${provider}`);
    }

    // Generate and store state for CSRF protection
    const state = generateState();
    storeState(state);

    // Build URL parameters
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        state: state,
        // Add context to state for backend to know if it's login or register
        // The backend can parse this from the state parameter if needed
    });

    // Add provider-specific parameters
    if (provider === 'google') {
        params.append('access_type', 'offline');
        params.append('prompt', 'consent');
    }

    return `${config.authorizationEndpoint}?${params.toString()}`;
};

/**
 * Open OAuth popup window
 * 
 * @param provider - OAuth provider slug
 * @param context - Context for the OAuth flow
 * @returns Window reference to the popup
 */
export const openOAuthPopup = (
    provider: 'google' | 'github',
    context: 'login' | 'register' = 'login'
): Window | null => {
    const authUrl = buildOAuthUrl(provider, context);

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    return window.open(
        authUrl,
        `OAuth ${provider}`,
        `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );
};

/**
 * Token Response Interface
 */
export interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    id_token?: string;
}

/**
 * Exchange authorization code for access token
 * WARNING: This exposes your client secret in the frontend!
 * 
 * @param provider - OAuth provider slug
 * @param code - Authorization code from OAuth callback
 * @returns Token response with access_token, refresh_token, etc.
 */
export const exchangeCodeForToken = async (
    provider: 'google' | 'github',
    code: string
): Promise<TokenResponse> => {
    const config = oauth2Config[provider];

    if (!config.tokenEndpoint) {
        throw new Error(`Token endpoint not configured for ${provider}`);
    }

    if (!config.clientSecret) {
        throw new Error(`Client secret not configured for ${provider}. Add NEXT_PUBLIC_GOOGLE_CLIENT_SECRET to your environment variables.`);
    }

    const body = new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
    });

    const response = await fetch(config.tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error || response.statusText}`);
    }

    return await response.json();
};
