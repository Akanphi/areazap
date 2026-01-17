import React from 'react';
import { Code, Terminal, Cpu, Share2 } from 'lucide-react';

export default function DevPlatformPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <div className="inline-block px-3 py-1 bg-purple-900/50 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-4">
                            Area for Developers
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Build powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">integrations</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg">
                            Extend Area's capabilities by building custom triggers and actions. Use our CLI and API to create seamless connections.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors">
                                Read the Docs
                            </button>
                            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors border border-gray-700">
                                Get API Key
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl font-mono text-sm">
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-2">
                            <p><span className="text-green-400">$</span> npm install -g area-cli</p>
                            <p className="text-gray-500">Installing Area CLI v2.0.0...</p>
                            <p><span className="text-green-400">$</span> area init my-integration</p>
                            <p className="text-gray-500">Created project structure.</p>
                            <p><span className="text-green-400">$</span> area deploy</p>
                            <p className="text-purple-400">Successfully deployed integration!</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                        <Terminal className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">CLI Tools</h3>
                        <p className="text-gray-400">Develop, test, and deploy your integrations directly from your terminal.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-pink-500/50 transition-colors">
                        <Cpu className="w-10 h-10 text-pink-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Robust API</h3>
                        <p className="text-gray-400">Access all Area features programmatically with our REST and GraphQL APIs.</p>
                    </div>
                    <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors">
                        <Share2 className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Marketplace</h3>
                        <p className="text-gray-400">Publish your integrations to the Area Marketplace and reach millions of users.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
