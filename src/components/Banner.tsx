"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import YouTubeIcon from '@mui/icons-material/YouTube';

export const Banner = () => {
    const { isAuthenticated } = useAuth();
    return (
        <header className="bg-stone-50 text-gray-800 py-4 px-8">
            <nav className="flex flex-wrap justify-between items-center gap-4">
                <Link href="/" className="flex items-end gap-2 hover:opacity-80 transition-opacity">
                    <Image
                        className="dark:invert"
                        src="/logo.svg"
                        alt="Area logo"
                        width={100}
                        height={20}
                        priority
                    />
                    <h1 className="text-3xl sm:text-4xl pb-1 font-bold text-orange-600">
                        Area
                    </h1>
                </Link>

                <section className="hidden lg:flex gap-2 text-base font-medium">
                    <Link
                        href="/demonstrations"
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

                {/* Auth Buttons */}
                <section className="flex gap-3 items-center">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 transition-colors shadow-sm"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 font-medium hover:text-orange-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 transition-colors shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </section>
            </nav>
        </header>
    );
};