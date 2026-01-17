"use client";

import { useState } from "react";
import {
    Check,
    Zap,
    Shield,
    Globe,
    CreditCard,
    Clock,
    AlertCircle
} from "lucide-react";

const PLANS = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for getting started with basic automations",
        features: [
            "5 Active Zaps",
            "100 Executions / month",
            "15-minute update interval",
            "Core App Integrations",
            "Community Support"
        ],
        buttonText: "Current Plan",
        current: true,
        color: "gray"
    },
    {
        name: "Pro",
        price: "29",
        description: "Advanced features for power users and small teams",
        features: [
            "Unlimited Active Zaps",
            "5,000 Executions / month",
            "1-minute update interval",
            "Premium App Integrations",
            "Priority Email Support",
            "Multi-step Zaps"
        ],
        buttonText: "Upgrade to Pro",
        current: false,
        popular: true,
        color: "purple"
    },
    {
        name: "Business",
        price: "99",
        description: "Enterprise-grade power for scaling businesses",
        features: [
            "Unlimited everything",
            "50,000 Executions / month",
            "Instant update interval",
            "Custom App Integrations",
            "24/7 Phone Support",
            "Advanced Security & SSO",
            "Shared Team Workspaces"
        ],
        buttonText: "Contact Sales",
        current: false,
        color: "emerald"
    }
];

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState("monthly");

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-[#07BB9C] bg-clip-text text-transparent mb-4">
                        Plans & Subscription
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan for your automation needs. Scale as you grow.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/80 backdrop-blur-md p-1 rounded-2xl shadow-md border border-gray-100 flex">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${billingCycle === "monthly"
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${billingCycle === "yearly"
                                    ? "bg-purple-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            Yearly
                            <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 hover:scale-105 ${plan.popular
                                    ? "border-purple-400 shadow-purple-100"
                                    : "border-gray-100"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-900">${billingCycle === "yearly" ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                                {billingCycle === "yearly" && plan.price !== "0" && (
                                    <p className="text-xs text-green-600 mt-1">Billed annually (${Math.floor(parseInt(plan.price) * 0.8 * 12)}/year)</p>
                                )}
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                                plan.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${plan.current
                                        ? "bg-gray-100 text-gray-500 cursor-default"
                                        : plan.color === 'purple'
                                            ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 hover:scale-105"
                                            : "bg-gray-900 text-white hover:bg-gray-800 hover:scale-105"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Current Plan Details */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-purple-600" />
                                Current Plan Details
                            </h3>
                            <p className="text-gray-600">You are currently on the <span className="font-bold text-purple-600">Free Plan</span></p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Next Billing Date</p>
                                <p className="text-sm font-semibold text-gray-900">N/A (Free)</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-900">None</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Executions Usage</span>
                                <span className="text-sm font-bold text-purple-600">42 / 100</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Resets in 12 days
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Active Zaps</span>
                                <span className="text-sm font-bold text-purple-600">3 / 5</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ or Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Need a custom plan?</h4>
                        <p className="text-blue-800 text-sm">
                            If your needs exceed our standard plans, we offer custom enterprise solutions with dedicated support,
                            unlimited executions, and custom integrations. <a href="#" className="underline font-bold">Talk to our team</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
