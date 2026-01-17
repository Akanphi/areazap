"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { handleOAuthCallback } from "@/api/services";

function OAuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (!code || !state) {
                setStatus('error');
                setMessage('Missing authorization code or state');
                return;
            }

            try {
                const data = await handleOAuthCallback({ code, state });

                if (data.success) {
                    setStatus('success');
                    setMessage(data.message || 'Service authorized successfully!');

                    if (data.service_account_id) {
                        localStorage.setItem('last_service_account_id', data.service_account_id);
                    }

                    // Send message to parent window if it's a popup
                    if (window.opener) {
                        window.opener.postMessage({ type: 'oauth_success', service: data.service }, window.location.origin);
                    }

                    setTimeout(() => {
                        if (window.opener) {
                            window.close();
                        } else {
                            router.push('/area-editor');
                        }
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Authorization failed');
                }
            } catch (error: any) {
                console.error('OAuth callback error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred during authorization');
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border-2 border-gray-200 max-w-md w-full">
                {status === 'loading' && (
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authorizing Service...
                        </h2>
                        <p className="text-gray-600">Please wait while we complete the authorization</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Success!
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Authorization Failed
                        </h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <button
                            onClick={() => router.push('/area-editor')}
                            className="px-6 py-3 bg-gradient-to-r from-slate-600 to-sky-400 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                        >
                            Return to Editor
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
        }>
            <OAuthCallbackContent />
        </Suspense>
    );
}

