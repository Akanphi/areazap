"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, getCurrentUser, login as apiLogin, logout as apiLogout, LoginData } from '@/api/auth';
// import { ServiceAccount, getServiceAccounts } from '@/api/serviceAccounts'; // Removed for cleanup

interface ServiceAccount {
    id: string;
    display_name: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    serviceAccounts: ServiceAccount[];
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    refreshServices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>([]); // Removed for cleanup
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    /*
    const refreshServices = async () => {
        try {
            const accounts = await getServiceAccounts();
            setServiceAccounts(accounts);
        } catch (error) {
            console.error("Failed to fetch service accounts", error);
        }
    };
    */

    const refreshProfile = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            // await refreshServices(); // Removed for cleanup
        } catch (error: any) {
            console.error("Failed to fetch user profile", error);
            // Only logout if it's an authentication error (401)
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    const login = async (data: LoginData) => {
        await apiLogin(data);
        await refreshProfile();
        router.push('/dashboard'); // Default redirect after login
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
        // setServiceAccounts([]); // Removed for cleanup
        router.push('/login');
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access');
            if (token) {
                try {
                    await refreshProfile();
                } catch (error: any) {
                    // Only logout if it's an authentication error (401)
                    // For other errors (network, server), keep the token and try again later
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Optional: Protect routes
    useEffect(() => {
        const publicRoutes = ['/login', '/register', '/verify-email', '/', '/reset-password'];
        if (!isLoading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login');
        }
    }, [user, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            // serviceAccounts, // Removed for cleanup
            serviceAccounts: [], // Mock empty array
            login,
            logout,
            refreshProfile,
            refreshServices: async () => { } // Mock function
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
