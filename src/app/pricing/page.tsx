import React from 'react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Choose the perfect plan for your automation needs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {/* Free Plan */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                        <p className="text-3xl font-bold text-purple-600 my-4">$0<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                        <ul className="text-left text-gray-600 space-y-3 mb-8">
                            <li>✓ 5 Zaps</li>
                            <li>✓ 100 Tasks/month</li>
                            <li>✓ 15min Update Time</li>
                        </ul>
                        <button className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors">Current Plan</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="border border-purple-200 bg-purple-50 rounded-xl p-6 hover:shadow-md transition-shadow relative">
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">Popular</div>
                        <h3 className="text-xl font-semibold text-gray-900">Professional</h3>
                        <p className="text-3xl font-bold text-purple-600 my-4">$19<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                        <ul className="text-left text-gray-600 space-y-3 mb-8">
                            <li>✓ 20 Zaps</li>
                            <li>✓ 1,000 Tasks/month</li>
                            <li>✓ 2min Update Time</li>
                            <li>✓ Multi-step Zaps</li>
                        </ul>
                        <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">Upgrade</button>
                    </div>

                    {/* Team Plan */}
                    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-900">Team</h3>
                        <p className="text-3xl font-bold text-purple-600 my-4">$49<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                        <ul className="text-left text-gray-600 space-y-3 mb-8">
                            <li>✓ Unlimited Zaps</li>
                            <li>✓ 5,000 Tasks/month</li>
                            <li>✓ 1min Update Time</li>
                            <li>✓ Unlimited Users</li>
                        </ul>
                        <button className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
