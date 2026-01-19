"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { register } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import AlertError from "@/components/ui/AlertError";
import { API_URL } from "@/api/api";

export default function Register() {
    const router = useRouter();
    const { refreshProfile } = useAuth();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await register(formData);
            setSuccess("Account created successfully! You'll be redirected to verify your email...");
            setTimeout(() => {
                router.push('/verify-email');
            }, 2000);
        } catch (err: any) {
            console.error("Registration failed:", err.response?.data);
            const errorData = err.response?.data;
            let errorMessage = "An error occurred during registration";

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (typeof errorData === 'object') {
                    // Extract the first error message from any field
                    const firstKey = Object.keys(errorData)[0];
                    const firstError = errorData[firstKey];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSocialLogin = (provider: 'google' | 'github') => {
        const { openOAuthPopup } = require('@/config/oauth.config');

        const popup = openOAuthPopup(provider, 'register');

        if (!popup) {
            setError('Failed to open authentication window. Please check your popup blocker settings.');
            return;
        }

        const handleMessage = async (event: MessageEvent) => {
            console.log("[Register] Message received:", event);
            console.log("[Register] Event origin:", event.origin);
            console.log("[Register] Window origin:", window.location.origin);
            console.log("[Register] Event data:", event.data);

            if (event.origin !== window.location.origin) {
                console.warn("[Register] Origin mismatch - message ignored");
                return;
            }

            console.log("Google return : ", event.data);
            if (event.data.type === "OAUTH_SUCCESS") {
                const { access, refresh, user } = event.data;

                if (access) {
                    // Store credentials
                    localStorage.setItem('access', access);
                    if (refresh) {
                        localStorage.setItem('refresh', refresh);
                    }
                    if (user) {
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    // Refresh profile and redirect
                    await refreshProfile();
                    router.push('/dashboard');
                }

                window.removeEventListener("message", handleMessage);
            } else if (event.data.type === "OAUTH_ERROR") {
                setError(event.data.error || "Authentication failed");
                window.removeEventListener("message", handleMessage);
            }
        };

        window.addEventListener("message", handleMessage);

        // Cleanup listener if popup is closed without completing auth
        const checkPopupClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopupClosed);
                window.removeEventListener("message", handleMessage);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
                    <p className="text-gray-600">Join Area and start automating</p>
                </div>

                {/* Formulaire d'inscription */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <div className="relative">
                                    <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email.toLowerCase()}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                    placeholder="john.doe@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <VisibilityIcon className="w-5 h-5" /> : <VisibilityOffIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <VisibilityIcon className="w-5 h-5" /> : <VisibilityOffIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full cursor-pointer bg-[#1DD3C3] hover:bg-[#00E5CC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#1DD3C3]/20"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowForwardIcon className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {success && (
                            <div className="bg-green-50 border border-green-100 text-green-600 text-sm p-3 rounded-xl text-center animate-in fade-in slide-in-from-top-1">
                                {success}
                            </div>
                        )}
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('google')}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                                <GoogleIcon className="h-5 w-5 text-[#4285F4]" />
                                <span>Google</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('github')}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
                            >
                                <GitHubIcon className="h-5 w-5 text-[#24292F]" />
                                <span>GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Alert Error Popup */}
                <AlertError
                    message={error}
                    isVisible={!!error}
                    onClose={() => setError('')}
                />

                {/* Lien connexion */}
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#C174F2] hover:text-[#F18585] font-medium transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
