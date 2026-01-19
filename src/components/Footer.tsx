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
        <footer className="bg-[#ECE5DD] px-8">
            <section className="top flex items-center justify-between pt-15 -mt-10">
                <div className="flex items-center">
                    <h2 className="text-xl">Follow us</h2>
                    <div className="transition-colors duration-150 cursor-pointer">
                        <FacebookIcon className=" hover:text-[#1877F2] rounded-full" sx={{ fontSize: 40 }} />
                        <LinkedInIcon className=" hover:text-[#0077B5] rounded-full" sx={{ fontSize: 40 }} />
                        <YouTubeIcon className=" hover:text-[#FF0033]  rounded-full" sx={{ fontSize: 40 }} />
                    </div>
                </div>
                <div className="flex gap-3 text-lg">
                    <Link href="/pricing" className="nav-link">Pricing</Link>
                    <Link href="/help " className="nav-link">Help</Link>
                    <Link href="/integrations" className="nav-link">App Integrations</Link>
                    <Link href="/dev-platform" className="nav-link">Developer platform</Link>
                    <Link href="/top-search" className="nav-link">Top search</Link>
                </div>
            </section>
            <section className="bottom flex items-center justify-between">
                <Image
                    className=""
                    src="/logo.png"
                    alt="Area logo"
                    width={60}
                    height={0}
                    style={{ height: 'auto' }}
                    priority
                />
                <div className="flex gap-3 items-center">
                    <CopyrightIcon sx={{ fontSize: 20 }} />
                    <span className="">{annee.getFullYear()} Area Inc.</span>
                    <Link href="/terms" className="nav-link">Legal</Link>
                    <Link href="/privacy" className="nav-link">Privacy</Link>
                </div>
            </section>
        </footer>
    )
}