"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleOAuthCallback } from "@/api/services";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function OAuthCallbackContent() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Extract all parameters from the URL (code, state, etc.)
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                // Pass these parameters to the backend to exchange for tokens
                const data = await handleOAuthCallback(params);

                // If tokens are returned (login/register flow), store them
                if (data?.access) {
                    localStorage.setItem('access', data.access);
                    if (data.refresh) {
                        localStorage.setItem('refresh', data.refresh);
                    }
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                }

                setStatus("success");

                // Redirect after a short delay to show the success state
                setTimeout(() => {
                    if (window.opener) {
                        // If opened as a popup, notify the parent and close
                        window.opener.postMessage({
                            type: "OAUTH_SUCCESS",
                            isAuthenticated: !!data?.access
                        }, window.location.origin);
                        window.close();
                    } else {
                        // Otherwise redirect to services page or dashboard
                        router.push(data?.access ? "/dashboard" : "/services");
                    }
                }, 2000);
            } catch (err: any) {
                console.error("OAuth callback failed:", err);
                const errorMessage = err.response?.data?.detail || "Failed to connect account. Please try again.";
                setStatus("error");
                setError(errorMessage);

                if (window.opener) {
                    window.opener.postMessage({
                        type: "OAUTH_ERROR",
                        error: errorMessage
                    }, window.location.origin);
                }
            }
        };

        processCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-500">
                    <div className="p-10 text-center">
                        {status === "loading" && (
                            <div className="space-y-6 animate-in fade-in duration-700">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
                                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Connecting Account</h2>
                                    <p className="text-gray-600">Linking your account securely...</p>
                                </div>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="space-y-6 animate-in zoom-in-95 fade-in duration-500">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
                                    <p className="text-gray-600">Your account has been connected.</p>
                                </div>
                                <div className="pt-6">
                                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 animate-[progress_2s_linear]" style={{ width: '100%' }} />
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Securely connected</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Redirecting...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                                        <XCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Connection Failed</h2>
                                    <p className="text-red-600/80">{error}</p>
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

            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
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

