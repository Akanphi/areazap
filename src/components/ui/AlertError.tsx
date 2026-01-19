"use client";

import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface AlertErrorProps {
    message: string;
    onClose: () => void;
    isVisible: boolean;
    autoHideDuration?: number;
}

export default function AlertError({ message, onClose, isVisible, autoHideDuration = 5000 }: AlertErrorProps) {
    useEffect(() => {
        if (isVisible && autoHideDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, autoHideDuration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-white/80 p-4 shadow-2xl backdrop-blur-xl">
                {/* Background Glow */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#1DD3C3]/10 blur-2xl" />

                <div className="relative flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>

                    <div className="flex-1 pt-1">
                        <h3 className="text-sm font-bold text-gray-900">Error</h3>
                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                    >
                        <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>

                {/* Progress Bar for Auto-hide */}
                {autoHideDuration > 0 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-red-500/20 w-full overflow-hidden">
                        <div
                            className="h-full bg-red-500 transition-all duration-[5000ms] ease-linear"
                            style={{
                                width: isVisible ? '0%' : '100%',
                                animation: `shrink ${autoHideDuration}ms linear forwards`
                            }}
                        />
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
}
