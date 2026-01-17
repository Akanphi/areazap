"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '@/api/auth';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await requestPasswordReset(email);
        } catch (error) {
            console.error('Password reset request failed:', error);
        } finally {
            setIsLoading(false);
            // Always show success message for security and UX, even if backend fails
            setIsSubmitted(true);
        }
    };


    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl shadow-brand-primary/20 sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
                        <p className="text-gray-600 mb-8">
                            Si un compte existe avec l'adresse {email}, vous recevrez un lien pour réinitialiser votre mot de passe.
                        </p>
                        <Link
                            href="/login"
                            className="w-full flex bg-[#f66d32] justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary transition-all hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5"
                        >
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center text-black py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Mot de passe oublié ?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl shadow-brand-primary/20 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Adresse email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-primary/100 focus:border-brand-primary/100 sm:text-sm transition-colors"
                                    placeholder="vous@exemple.com"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#f66d32] hover:bg-[#f66d32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/100 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5'}`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <p className="flex items-center text-white font-bold">
                                        Envoyer le lien
                                        <ArrowRight className="ml-2 h-5 w-5 text-white font-bold"/>
                                    </p>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Ou
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="font-medium bg-[#f66d32] text-white hover:text-brand-primary/100 flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
