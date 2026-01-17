"use client";

import React from 'react';
import { Zap, Play, ArrowRight, Settings, Layers, MousePointer2, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
    {
        title: "1. Choose a Trigger",
        desc: "An event that starts your automation. Like a new email in Gmail or a new lead in your CRM.",
        icon: <Play className="w-8 h-8 text-orange-500" />,
        color: "bg-orange-50",
        border: "border-orange-100"
    },
    {
        title: "2. Set an Action",
        desc: "The event that happens automatically. Like sending a Slack message or creating a Trello card.",
        icon: <Settings className="w-8 h-8 text-blue-500" />,
        color: "bg-blue-50",
        border: "border-blue-100"
    },
    {
        title: "3. Turn it On",
        desc: "Once your Zap is active, it runs automatically 24/7, so you can focus on what matters.",
        icon: <Zap className="w-8 h-8 text-purple-500" />,
        color: "bg-purple-50",
        border: "border-purple-100"
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-stone-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-orange-600 uppercase bg-orange-50 rounded-full">
                        The Basics
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight font-epilogue">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600">Area</span> Works
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Area connects your apps and automates your workflows.
                        It's simple, powerful, and requires zero coding knowledge.
                    </p>
                </div>

                {/* Core Concepts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                    {STEPS.map((step, index) => (
                        <div key={index} className="relative group">
                            <div className={`absolute -inset-4 ${step.color} rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 -z-10`}></div>
                            <div className={`bg-white p-10 rounded-[2rem] border ${step.border} shadow-sm h-full flex flex-col items-center text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-xl`}>
                                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                            {index < 2 && (
                                <div className="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                                    <ArrowRight className="w-12 h-12 text-slate-200" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-32 mb-32">
                    {/* Triggers */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-sm">
                                <MousePointer2 className="w-4 h-4" />
                                Concept 01
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-epilogue">
                                What is a <span className="text-orange-600">Trigger</span>?
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                A trigger is the event that starts your automation. Think of it as the "When this happens" part of your workflow.
                                You can choose from hundreds of apps and thousands of events.
                            </p>
                            <ul className="space-y-4">
                                {["New email in Gmail", "New lead in Salesforce", "New file in Dropbox", "New mention on Twitter"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 bg-white p-8 rounded-[3rem] shadow-2xl border border-stone-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                            <img src="/automation.png" alt="Trigger Example" className="relative z-10 rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                                <Sparkles className="w-4 h-4" />
                                Concept 02
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-epilogue">
                                What is an <span className="text-blue-600">Action</span>?
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                An action is the event that Area performs automatically after your trigger occurs.
                                It's the "Do this" part of your workflow. You can even chain multiple actions together.
                            </p>
                            <ul className="space-y-4">
                                {["Send a Slack message", "Create a Trello card", "Update a Google Sheet", "Post to Instagram"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 bg-white p-8 rounded-[3rem] shadow-2xl border border-stone-100 relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50"></div>
                            <img src="/proof.png" alt="Action Example" className="relative z-10 rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/footbg.jpg')] bg-cover bg-center opacity-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-epilogue">
                            Ready to save time?
                        </h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                            Join thousands of users who are already automating their work with Area.
                            Start your first Zap in less than 2 minutes.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/register" className="px-10 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all hover:scale-105 shadow-xl shadow-orange-600/20">
                                Get Started Free
                            </Link>
                            <Link href="/integrations" className="px-10 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md border border-white/20">
                                Explore Integrations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
