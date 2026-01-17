"use client";

import React from 'react';
import Image from 'next/image';

const INTEGRATIONS = [
    { name: 'Google', icon: '/google.svg', desc: 'Connect with Gmail, Calendar, and Drive.' },
    { name: 'GitHub', icon: '/github.svg', desc: 'Automate your development workflow.' },
    { name: 'Slack', icon: '/slack.svg', desc: 'Send messages and manage channels.' },
    { name: 'Discord', icon: '/discord.svg', desc: 'Manage your community servers.' },
    { name: 'Telegram', icon: '/telegram.svg', desc: 'Build bots and automate chats.' },
    { name: 'Notion', icon: '/notion.svg', desc: 'Organize your workspace automatically.' },
    { name: 'Trello', icon: '/trello.svg', desc: 'Manage projects and tasks.' },
    { name: 'Spotify', icon: '/spotify.svg', desc: 'Control your music and playlists.' },
];

export default function IntegrationsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect your favorite apps</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Area integrates with thousands of the most popular apps, so you can automate your work and have more time for what matters.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {INTEGRATIONS.map((app) => (
                        <div key={app.name} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border border-gray-100">
                            <div className="w-12 h-12 mb-4 relative">
                                <Image
                                    src={app.icon}
                                    alt={app.name}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                        
                                    }}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{app.name}</h3>
                            <p className="text-gray-600 text-sm">{app.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-[#f66d32] rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Don't see your app?</h2>
                    <p className="text-purple-100 mb-8 max-w-xl mx-auto">
                        We're constantly adding new integrations. You can build your own using our Developer Platform or request a new integration.
                    </p>
                    <div className="flex justify-center gap-4 ">
                        <button className="px-6 py-3 bg-white cursor-pointer text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                            Build Integration
                        </button>
                        <button className="px-6 py-3 cursor-pointer bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition-colors border border-purple-500">
                            Request App
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
