"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { validateTokenAndResetPassword } from '@/api/auth';

import { Suspense } from 'react';

const VerifyResetContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCodeValidated, setIsCodeValidated] = useState(false);
    const [validatedToken, setValidatedToken] = useState('');

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) {
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];

        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }

        setCode(newCode);
    };

    const handleCodeValidation = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const token = code.join('');

        if (token.length !== 6) {
            setError('Veuillez entrer le code complet à 6 chiffres');
            return;
        }

        setIsLoading(true);

        try {
            // Just validate length locally and move to password step
            // The actual validation will happen when submitting the password
            setValidatedToken(token);
            setIsCodeValidated(true);
            setError('');
        } catch (error: any) {
            console.error('Validation failed:', error);
            setError('Une erreur est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);

        try {
            await validateTokenAndResetPassword({
                token: validatedToken,
                purpose: 'Reset_password',
                password,
                password_confirmation: passwordConfirmation,
            });

            // Redirect to login on success
            router.push('/login?reset=success');
        } catch (error: any) {
            console.error('Password reset failed:', error);
            setError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                'Erreur lors de la réinitialisation. Veuillez réessayer.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center text-black py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {!isCodeValidated ? 'Vérification du code' : 'Nouveau mot de passe'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {!isCodeValidated
                            ? `Entrez le code à 6 chiffres envoyé à ${email}`
                            : 'Choisissez un nouveau mot de passe sécurisé'
                        }
                    </p>
                </div>

                <div className="bg-white py-8 px-4 shadow-xl shadow-brand-primary/20 sm:rounded-2xl sm:px-10 border border-gray-100">
                    {!isCodeValidated ? (
                        <form className="space-y-6" onSubmit={handleCodeValidation}>
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                    Code de vérification
                                </label>
                                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary/100 focus:border-brand-primary/100 transition-colors"
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1DD3C3] hover:bg-[#1DD3C3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/100 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5'}`}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span className="font-bold">Valider le code</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Nouveau mot de passe
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-primary/100 focus:border-brand-primary/100 sm:text-sm transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                                    Confirmer le mot de passe
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="passwordConfirmation"
                                        name="passwordConfirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-primary/100 focus:border-brand-primary/100 sm:text-sm transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1DD3C3] hover:bg-[#1DD3C3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/100 transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-brand-primary/30 transform hover:-translate-y-0.5'}`}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span className="font-bold">Réinitialiser le mot de passe</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

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
                            <Link href="/reset-password" className="font-medium text-black hover:text-brand-primary/100 flex items-center justify-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Renvoyer un code
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerifyResetPage = () => {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <VerifyResetContent />
        </Suspense>
    );
};

export default VerifyResetPage;
