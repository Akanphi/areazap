"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { submitOAuthCode, pollOAuthSession } from "@/api/services";
import { validateState, exchangeCodeForToken, type TokenResponse } from "@/config/oauth.config";

function OAuthCallbackContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Connecting your account...');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Extract parameters from URL
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                // 🔍 LOG: Afficher TOUS les paramètres retournés par Google
                console.log('═══════════════════════════════════════');
                console.log('📨 GOOGLE OAUTH CALLBACK - Paramètres reçus:');
                console.log('═══════════════════════════════════════');
                console.log('✅ code:', code);
                console.log('🔐 state:', state);
                console.log('❌ error:', error);
                console.log('📝 error_description:', errorDescription);
                console.log('🌐 URL complète:', window.location.href);
                console.log('📋 Tous les paramètres URL:');
                searchParams.forEach((value, key) => {
                    console.log(`   ${key}: ${value}`);
                });
                console.log('═══════════════════════════════════════');

                // Handle OAuth errors
                if (error) {
                    setStatus('error');
                    setMessage(errorDescription || `OAuth error: ${error}`);
                    sendErrorToParent(errorDescription || `OAuth error: ${error}`);
                    return;
                }

                // Validate required parameters
                if (!code || !state) {
                    setStatus('error');
                    setMessage('Missing authorization code or state parameter');
                    sendErrorToParent('Missing authorization code or state parameter');
                    return;
                }

                // Validate state for CSRF protection
                if (!validateState(state)) {
                    setStatus('error');
                    setMessage('Invalid state parameter. Possible CSRF attack.');
                    sendErrorToParent('Invalid state parameter');
                    return;
                }

                // Determine provider from referrer or state
                const provider = determineProvider();
                if (!provider) {
                    setStatus('error');
                    setMessage('Unable to determine OAuth provider');
                    sendErrorToParent('Unable to determine OAuth provider');
                    return;
                }

                setMessage('Exchanging authorization code for access token...');
                setProgress(20);

                // Exchange authorization code for access token (client-side)
                const tokenResponse = await exchangeCodeForToken(provider as 'google' | 'github', code);

                console.log('✅ Token exchange successful!');
                console.log('📦 Google Token Response Payload:', tokenResponse);
                console.log('Access token received:', tokenResponse.access_token.substring(0, 20) + '...');

                // Display token response in UI (User Request)
                setStatus('success');
                setMessage('Google Token Exchange Successful!');
                setProgress(100);

                // Send success to parent with just the token response for now
                sendSuccessToParent({
                    provider: 'google',
                    token_response: tokenResponse
                });

                // Commented out backend submission as requested
                /*
                setMessage('Sending access token to server...');
                setProgress(50);

                // Submit access token to backend
                const sessionResponse = await submitOAuthCode({
                    code: tokenResponse.access_token, // Send access token instead of auth code
                    state,
                    provider,
                });

                const sessionId = sessionResponse.session_id;
                setMessage('Waiting for authentication...');
                setProgress(70);

                // Poll for session credentials
                const credentials = await pollForCredentials(sessionId);

                if (credentials.status === 'success' && credentials.access) {
                    setStatus('success');
                    setMessage('Successfully authenticated!');
                    setProgress(100);

                    // Send credentials to parent window
                    sendSuccessToParent({
                        access: credentials.access,
                        refresh: credentials.refresh,
                        user: credentials.user,
                    });

                    // Close popup after a short delay
                    setTimeout(() => {
                        window.close();
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage(credentials.error || 'Authentication failed');
                    sendErrorToParent(credentials.error || 'Authentication failed');
                }
                */
            } catch (error: any) {
                console.error('OAuth callback error:', error);
                setStatus('error');
                const errorMessage = error.response?.data?.detail || error.message || 'An error occurred during authentication';
                setMessage(errorMessage);
                sendErrorToParent(errorMessage);
            }
        };

        handleCallback();
    }, [searchParams]);

    /**
     * Determine OAuth provider from URL or referrer
     */
    const determineProvider = (): string | null => {
        const referrer = document.referrer.toLowerCase();
        if (referrer.includes('google')) return 'google';
        if (referrer.includes('github')) return 'github';

        // Fallback: check URL parameters or session storage
        const urlProvider = searchParams.get('provider');
        if (urlProvider) return urlProvider;

        return null;
    };

    /**
     * Poll backend for session credentials
     */
    const pollForCredentials = async (sessionId: string, maxAttempts = 30, interval = 1000) => {
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const response = await pollOAuthSession(sessionId);

                if (response.status === 'success') {
                    return response;
                } else if (response.status === 'error') {
                    return response;
                }

                // Update progress
                setProgress(40 + (attempts / maxAttempts) * 50);

                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, interval));
                attempts++;
            } catch (error) {
                console.error('Polling error:', error);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }

        // Timeout
        return {
            status: 'error' as const,
            error: 'Authentication timeout. Please try again.',
        };
    };

    /**
     * Send success message to parent window
     */
    const sendSuccessToParent = (credentials: any) => {
        console.log('[OAuth Callback] Attempting to send success to parent');
        console.log('[OAuth Callback] window.opener exists:', !!window.opener);
        console.log('[OAuth Callback] Credentials:', credentials);

        if (window.opener) {
            try {
                window.opener.postMessage({
                    type: 'OAUTH_SUCCESS',
                    ...credentials,
                }, window.location.origin);
                console.log('[OAuth Callback] Message sent successfully');
            } catch (error) {
                console.error('[OAuth Callback] Failed to send message:', error);
            }
        } else {
            console.error('[OAuth Callback] window.opener is null - popup may have lost parent reference');
        }
    };

    /**
     * Send error message to parent window
     */
    const sendErrorToParent = (error: string) => {
        console.log('[OAuth Callback] Attempting to send error to parent:', error);
        console.log('[OAuth Callback] window.opener exists:', !!window.opener);

        if (window.opener) {
            try {
                window.opener.postMessage({
                    type: 'OAUTH_ERROR',
                    error,
                }, window.location.origin);
                console.log('[OAuth Callback] Error message sent successfully');
            } catch (error) {
                console.error('[OAuth Callback] Failed to send error message:', error);
            }
        } else {
            console.error('[OAuth Callback] window.opener is null');
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
                    <div className="p-10 text-center">
                        {status === 'loading' && (
                            <div className="space-y-6 animate-in fade-in duration-700">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
                                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Authenticating</h2>
                                    <p className="text-gray-600">{message}</p>
                                </div>
                                <div className="pt-4">
                                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-600 transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{progress}% complete</p>
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
                                    <p className="text-gray-600">{message}</p>
                                </div>
                                <div className="pt-4">
                                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-full" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Redirecting...</p>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                                        <XCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Authentication Failed</h2>
                                    <p className="text-red-600/80">{message}</p>
                                </div>
                                <button
                                    onClick={() => window.close()}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
                                >
                                    Close Window
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
                        Area Automation
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        }>
            <OAuthCallbackContent />
        </Suspense>
    );
}
