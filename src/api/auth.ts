import api from './api'

export interface User {
  id: string;
  email: string;
  firstName?: string; // Legacy
  lastName?: string; // Legacy
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: 'ADMIN' | 'USER';
  phone?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// New API response structure
export interface LoginSuccess {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  access: string;
  refresh: string;
}

// Legacy support
export interface AuthResponse {
  user: User;
  tokens?: {
    access: string;
    refresh: string;
  };
  access?: string;
  refresh?: string;
}

export interface ConfirmationData {
  email: string;
}

export interface TokenActionRequest {
  token: string;
  purpose: 'Confirm_account' | 'Reset_password';
  password?: string;
  password_confirmation?: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export const refreshToken = async (refresh: string): Promise<TokenRefreshResponse> => {
  const response = await api.post<TokenRefreshResponse>('auth/refresh/', { refresh });
  return response.data;
};

export interface RegisterResponse {
  email: string;
  first_name: string;
  last_name: string;
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  detail: string;
}

export const requestPasswordReset = async (email: string): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>('reset-password/', { email });
  return response.data;
};

// Inscription
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('register/', data);
  return response.data;
};

export interface ResendConfirmationEmail {
  email: string;
}

export const sendConfirmation = async (email: string): Promise<void> => {
  await api.post('send-confirmation/', { email });
};

export const verifyEmail = async (data: TokenActionRequest): Promise<void> => {
  await api.post('token-action/', data);
};

export const login = async (data: LoginData): Promise<LoginSuccess> => {
  console.log("Attempting login with:", { email: data.email, passwordLength: data.password.length });
  try {
    const response = await api.post<LoginSuccess>('auth/login/', data);
    console.log("Login successful:", response.data);

    const { user, access, refresh } = response.data;

    if (access) {
      localStorage.setItem('access', access);
      if (refresh) {
        localStorage.setItem('refresh', refresh);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }

    return response.data;
  } catch (error: any) {
    console.error("Login failed:", error.response?.data || error.message);
    console.error("Status code:", error.response?.status);
    throw error;
  }
};


export const logout = async () => {
  const refresh = localStorage.getItem('refresh');
  if (refresh) {
    try {
      await api.post('auth/logout/', { refresh_token: refresh });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  }
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('auth/me/');
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access');
};

export const getRoleRoute = (role: User['role']): string => {
  if (!role) return '/user';
  const routes = {
    'ADMIN': '/administrateur',
    'USER': '/user',
  };
  return routes[role];
};