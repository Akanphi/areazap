"use client";
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Link from 'next/link';
import Image from 'next/image';
import CopyrightIcon from '@mui/icons-material/Copyright';





export const Footer = () => {
    const annee = new Date();
    return (
        <footer className="bg-[#ECE5DD] px-4 md:px-8 py-8 md:py-12">
            <section className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-8 md:mb-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h2 className="text-xl font-semibold">Follow us</h2>
                    <div className="flex gap-4 transition-colors duration-150 cursor-pointer">
                        <FacebookIcon className="hover:text-[#1877F2] transition-colors" sx={{ fontSize: 32 }} />
                        <LinkedInIcon className="hover:text-[#0077B5] transition-colors" sx={{ fontSize: 32 }} />
                        <YouTubeIcon className="hover:text-[#FF0033] transition-colors" sx={{ fontSize: 32 }} />
                    </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-base md:text-lg">
                    <Link href="/pricing" className="nav-link">Pricing</Link>
                    <Link href="/help" className="nav-link">Help</Link>
                    <Link href="/integrations" className="nav-link">App Integrations</Link>
                    <Link href="/dev-platform" className="nav-link">Developer platform</Link>
                    <Link href="/top-search" className="nav-link">Top search</Link>
                </div>
            </section>

            <div className="h-px bg-gray-300 w-full mb-8" />

            <section className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Area logo"
                        width={40}
                        height={40}
                        style={{ height: 'auto' }}
                        priority
                    />
                    <span className="font-bold text-xl">Area</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <CopyrightIcon sx={{ fontSize: 16 }} />
                        <span>{annee.getFullYear()} Area Inc.</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/terms" className="hover:text-gray-900 transition-colors">Legal</Link>
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
                    </div>
                </div>
            </section>
        </footer>
    )
}