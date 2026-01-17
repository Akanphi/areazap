import React from 'react';
import { Search, Book, MessageCircle, FileText } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for help articles..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Book className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
                        <p className="text-gray-600 text-sm">Browse detailed guides and API references.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <MessageCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Forum</h3>
                        <p className="text-gray-600 text-sm">Join the discussion with other developers.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Ticket</h3>
                        <p className="text-gray-600 text-sm">Contact our support team for assistance.</p>
                    </div>
                </div>

                <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group p-4 bg-gray-50 rounded-lg cursor-pointer">
                            <summary className="font-medium text-gray-900 flex justify-between items-center">
                                How do I create my first Zap?
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 text-gray-600 text-sm">To create a Zap, go to the Area Editor, select a trigger app and event, then choose an action app and event. Connect your accounts and turn it on!</p>
                        </details>
                        <details className="group p-4 bg-gray-50 rounded-lg cursor-pointer">
                            <summary className="font-medium text-gray-900 flex justify-between items-center">
                                What happens if my Zap fails?
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 text-gray-600 text-sm">If a Zap fails, we'll send you an email notification. You can view the error details in your dashboard logs and replay the task once fixed.</p>
                        </details>
                        <details className="group p-4 bg-gray-50 rounded-lg cursor-pointer">
                            <summary className="font-medium text-gray-900 flex justify-between items-center">
                                Can I cancel my subscription anytime?
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 text-gray-600 text-sm">Yes, you can cancel your subscription at any time from your billing settings. You'll retain access until the end of your billing period.</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
