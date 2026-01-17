import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const TRENDING_SEARCHES = [
    { term: "Automate Gmail attachments to Drive", volume: "High", growth: "+120%" },
    { term: "Sync Notion database with Google Calendar", volume: "High", growth: "+85%" },
    { term: "Post new Instagram photos to Twitter", volume: "Medium", growth: "+45%" },
    { term: "Save Slack messages to Trello", volume: "Medium", growth: "+30%" },
    { term: "Discord webhook examples", volume: "High", growth: "+200%" },
    { term: "Auto-reply to emails with AI", volume: "Very High", growth: "+350%" },
];

export default function TopSearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Trending Automations</h1>
                    <p className="text-gray-600 text-lg">
                        See what other users are searching for and building right now.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Top Searches (Last 24h)</h3>
                        <span className="text-sm text-gray-500">Updated 5 mins ago</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {TRENDING_SEARCHES.map((item, index) => (
                            <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-gray-300 w-8">#{index + 1}</span>
                                    <div>
                                        <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{item.term}</p>
                                        <span className="text-xs text-gray-500 inline-block mt-1 bg-gray-100 px-2 py-0.5 rounded-full">
                                            Volume: {item.volume}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.growth}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                        <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center justify-center gap-2 mx-auto">
                            View Full Report <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
