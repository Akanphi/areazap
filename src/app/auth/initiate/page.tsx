"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * DEPRECATED: This route is no longer used.
 * 
 * The OAuth flow has been updated to be frontend-initiated.
 * The frontend now constructs OAuth URLs directly and opens them in popups.
 * 
 * This page redirects to the login page.
 */
export default function DeprecatedInitiatePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login after a short delay
        const timer = setTimeout(() => {
            router.push('/login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-6 max-w-md w-full">
                <div className="flex justify-center">
                    <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Redirecting...</h2>
                    <p className="text-gray-600 text-sm">
                        This authentication method is deprecated.
                        <br />
                        Redirecting you to the login page.
                    </p>
                </div>
            </div>
        </div>
    );
}
