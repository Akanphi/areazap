"use client";

import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Code, Server, Smartphone, Rocket, Shield } from 'lucide-react';

const FOUNDERS = [
    {
        name: "A. Philippe",
        role: "Lead / Web-front",
        desc: "Architecting the visual experience and ensuring seamless user interactions across the platform.",
        icon: <Code className="w-6 h-6 text-[#1DD3C3]" />,
        github: "github.com/vrmelox",
        linkedin: "linkedin.com/in/aphilippefelipemelo",
        image: "/Philippe.png",
        email: "akandeabiodoun@gmail.com"
    },
    {
        name: "A. Aimane",
        role: "Backend Engineer",
        desc: "Building the robust and scalable infrastructure that powers Area's complex automation engine.",
        icon: <Server className="w-6 h-6 text-blue-500" />,
        github: "https://github.com/Aimane01",
        linkedin: "https://www.linkedin.com/in/aimane-alassane",
        image: "/Aimane.jpg",
        email:"aimane.alassane@epitech.eu"

    },
    {
        name: "D. Patrice",
        role: "Lead Mobile",
        desc: "Leading the mobile revolution, bringing the power of automation to your pocket with precision.",
        icon: <Smartphone className="w-6 h-6 text-purple-500" />,
        github: "https://github.com/PatriceDAGBE",
        linkedin: "https://www.linkedin.com/in/patrice-dagbe",
        image: "/Patrice.jpg",
        email: "patriko.dagbe@epitech.eu"
    },
    {
        name: "G. Amour",
        role: "Assist Mobile",
        desc: "Crafting intuitive mobile interfaces and ensuring a consistent experience across all devices.",
        icon: <Rocket className="w-6 h-6 text-pink-500" />,
        github: "https://github.com/amourguidi",
        linkedin: "http://www.linkedin.com/in/amour-guidi-23462a306",
        image: "/Amour.jpg",
        email: "guidiamourornel@gmail.com"
    },
    {
        name: "G. Oscar",
        role: "CI/CD Engineer",
        desc: "Streamlining our deployment pipelines and ensuring the highest standards of code quality and reliability.",
        icon: <Shield className="w-6 h-6 text-green-500" />,
        github: "github.com/oscar",
        linkedin: "https://www.linkedin.com/in/oscar-gbenou-34b910302",
        image: "/Oscar.jpg",
        email: "oscar27thgbenou@gmail.com"
    }
];

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h2 className="text-[#1DD3C3] font-bold tracking-widest uppercase text-xl mb-4 font-monoton">Our Story</h2>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-epilogue">
                        Born at <span className="text-[#1DD3C3]">Epitech</span>,<br />
                        Built for the World.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We are a team of five passionate engineers from Epitech, united by a single mission:
                        to democratize automation and help people reclaim their most valuable asset—time.
                    </p>
                </div>

                {/* Founders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                    {FOUNDERS.map((founder, index) => (

                        <div className="relative bg-[#ECE1E9] w-[300px] h-[330px] rounded-xl border-3 border-[#1DD3C3]">
                            <div className='absolute bottom-3 -left-3 w-[300px] h-[330px] rounded-xl border-2 border-[#1DD3C3] overflow-hidden bg-white'>
                                <Image
                                    src={founder.image}
                                    alt={founder.name}
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#5B7785] backdrop-blur-sm rounded-lg shadow-lg w-[80%]">
                                <h3 className="font-bold text-gray-900 text-center text-sm">{founder.name}</h3>
                                <p className="text-xs text-white text-center ">{founder.role}</p>
                                <div className="flex justify-center">
                                    <a href={founder.github} className="p-1 text-white hover:text-black hover:font-bold transition-all">
                                        <Github className="w-3 h-3" />
                                    </a>
                                    <a href={founder.linkedin} className="p-1 text-white hover:text-black hover:font-bold  transition-all">
                                        <Linkedin className="w-3 h-3" />
                                    </a>
                                    <a href={`mailto:${founder.email}`} className="p-1 text-white hover:text-black hover:font-bold transition-all">
                                        <Mail className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vision Section */}
                <section className="mt-32 relative group">
                    {/* Decorative background blur */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1DD3C3]/20 to-purple-100 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-white rounded-[3rem] p-8 md:p-20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden">
                        {/* Subtle Mesh Gradients */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DD3C3]/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

                        <div className="relative z-10 max-w-5xl mx-auto text-center">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-[#1DD3C3] uppercase bg-[#1DD3C3]/5 rounded-full">
                                Our Core Values
                            </span>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
                                Empowering every user through <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DD3C3] to-purple-600">
                                    accessible automation.
                                </span>
                            </h2>

                            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
                                We believe that automation shouldn't be a luxury reserved for large corporations.
                                By combining the rigorous technical foundation we gained at <span className="text-slate-900 font-semibold italic">Epitech</span> with a commitment to
                                user-centric design, we've built Area to be the most powerful yet accessible platform on the market.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 items-center justify-center">
                                <div className="flex flex-col items-center px-8 py-4">
                                    <div className="text-5xl font-black text-slate-900 mb-2 flex items-baseline">
                                        5<span className="text-[#1DD3C3] ml-1">.</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Founders</p>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">United Vision</p>
                                </div>

                                <div className="hidden md:block h-16 w-px bg-slate-100 mx-auto"></div>

                                <div className="flex flex-col items-center px-8 py-4">
                                    <div className="text-5xl font-black text-slate-900 mb-2">
                                        100<span className="text-purple-500 text-3xl font-bold">%</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">Epitech DNA</p>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Technical Excellence</p>
                                </div>

                                <div className="hidden md:block h-16 w-px bg-slate-100 mx-auto"></div>

                                <div className="flex flex-col items-center px-8 py-4">
                                    <div className="text-5xl font-black text-slate-900 mb-2 leading-none">
                                        ∞
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Possibilities</p>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Endless</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
