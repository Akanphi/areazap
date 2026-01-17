import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                <div className="prose prose-purple max-w-none text-gray-600 space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Area, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Service Description</h2>
                        <p>
                            Area provides an automation platform that connects various applications and services. We reserve the right to modify, suspend, or discontinue any part of the service at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Acceptable Use</h2>
                        <p>
                            You agree not to use the service for any unlawful purpose or in any way that could damage, disable, overburden, or impair the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
                        <p>
                            Area shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to update or change our Terms of Service at any time. Your continued use of the service after we post any modifications to the Terms of Service on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms of Service.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 mt-8">
                        <p className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
