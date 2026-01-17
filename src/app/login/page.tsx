"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from "@/contexts/AuthContext";
import AlertError from "@/components/ui/AlertError";
import { API_URL } from "@/api/api";

export default function Login() {
    const router = useRouter();
    const { login, refreshProfile } = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const payload = {
                email: formData.email,
                password: formData.password
            };

            await login(payload);
            // No need to manually redirect - AuthContext.login() handles it

        } catch (err: any) {
            console.error("Login failed:", err.response?.data);
            const errorData = err.response?.data;
            let errorMessage = "Email ou mot de passe incorrect";

            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;

                    // Check if account is not verified
                    if (errorMessage.toLowerCase().includes("not activated") ||
                        errorMessage.toLowerCase().includes("not active") ||
                        errorMessage.toLowerCase().includes("pas activé") ||
                        errorMessage.toLowerCase().includes("pas encore vérifié")) {
                        setError("Votre compte n'est pas encore activé. Redirection vers la page de vérification...");
                        setTimeout(() => {
                            router.push(`/verify-email?purpose=Confirm_account&email=${encodeURIComponent(formData.email)}`);
                        }, 2000);
                        return;
                    }
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

    const handleSocialLogin = (provider: string) => {
        const authUrl = `/auth/initiate?provider=${provider}`;

        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            authUrl,
            `Login with ${provider}`,
            `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
        );

        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "OAUTH_SUCCESS") {
                if (event.data.isAuthenticated) {
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
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back !</h2>
                    <p className="text-gray-600">Log in to your account to continue</p>
                </div>

                {/* Formulaire de connexion */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C174F2] focus:border-[#C174F2] transition-colors"
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


                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#C174F2] border-gray-300 rounded focus:ring-[#C174F2]"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link
                                href="/reset-password"
                                className="text-sm text-[#C174F2] hover:text-[#F18585] transition-colors"
                            >
                                Forgot your password ?
                            </Link>
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer  bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    Log in
                                    <ArrowForwardIcon className="w-5 h-5" />
                                </>
                            )}
                        </button>
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

                {/* Lien inscription */}
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account ?{" "}
                    <Link href="/register" className="text-[#C174F2] hover:text-[#F18585] font-medium transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}