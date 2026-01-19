"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export const Banner = () => {
    const { isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-stone-50 text-gray-800 py-4 px-4 md:px-8 relative z-50">
            <nav className="flex justify-between items-center">
                <Link href="/" className="flex items-end gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        src="/logo.png"
                        alt="Area logo"
                        width={70}
                        height={0}
                        style={{ height: 'auto' }}
                        priority
                    />
                    <h1 className="text-2xl sm:text-2xl pb-1 font-bold">
                        Area
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <section className="hidden lg:flex gap-2 text-base font-medium">
                    <Link
                        href="/how-it-works"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        How it works
                    </Link>
                    <Link
                        href="/integrations"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        Integrations
                    </Link>
                    <Link
                        href="/pricing"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/about-us"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        About us
                    </Link>
                </section>

                {/* Desktop Auth Buttons */}
                <section className="hidden lg:flex gap-3 items-center">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 bg-[#1DD3C3] text-white font-medium rounded-full hover:bg-[#00E5CC] transition-colors shadow-sm"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 font-medium hover:text-[#1DD3C3] transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 bg-[#1DD3C3] text-white font-medium rounded-full hover:bg-[#00E5CC] transition-colors shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </section>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-stone-50 border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
                    <Link
                        href="/how-it-works"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        How it works
                    </Link>
                    <Link
                        href="/integrations"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Integrations
                    </Link>
                    <Link
                        href="/pricing"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/about-us"
                        className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About us
                    </Link>
                    <div className="h-px bg-gray-200 my-2" />
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 bg-[#1DD3C3] text-white font-medium rounded-full hover:bg-[#00E5CC] transition-colors shadow-sm text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-2 font-medium hover:text-[#1DD3C3] transition-colors text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 bg-[#1DD3C3] text-white font-medium rounded-full hover:bg-[#00E5CC] transition-colors shadow-sm text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};