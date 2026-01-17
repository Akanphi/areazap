"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import api, { API_URL } from "@/api/api";

function InitiateOAuthContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const provider = searchParams.get("provider");

    useEffect(() => {
        if (!provider) {
            setError("No provider specified");
            return;
        }

        const fetchAuthUrl = async () => {
            try {
                // Pass the frontend's callback URL so the backend knows where to redirect after OAuth
                const redirectUri = `${window.location.origin}/auth/callback`;
                const response = await api.get(`auth/login/${provider}/`, {
                    params: { redirect_uri: redirectUri }
                });
                const { authorization_url } = response.data;

                if (authorization_url) {
                    window.location.href = authorization_url;
                } else {
                    setError("Failed to get authorization URL");
                }
            } catch (err: any) {
                console.error("Failed to initiate OAuth:", err);
                setError(err.response?.data?.detail || "Failed to connect to the service. Please try again.");
            }
        };

        fetchAuthUrl();
    }, [provider]);

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 max-w-sm w-full animate-in fade-in duration-500">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Connection Error</h2>
                    <p className="text-gray-600 text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.close()}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
                >
                    Close Window
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-8 max-w-md w-full animate-in fade-in duration-500">
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100">
                        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <Zap className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                    Connecting to <span className="capitalize">{provider}</span>
                </h2>
                <p className="text-gray-600 font-medium">
                    Redirecting you to authorize...
                </p>
            </div>

            <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 bg-orange-600/30 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function InitiateOAuthPage() {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md flex justify-center">
                <Suspense fallback={<Loader2 className="w-10 h-10 text-orange-600 animate-spin" />}>
                    <InitiateOAuthContent />
                </Suspense>
            </div>
        </div>
    );
}
