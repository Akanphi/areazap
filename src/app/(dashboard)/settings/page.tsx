"use client";

import { useState } from "react";
import {
    Settings,
    Bell,
    Lock,
    User,
    Globe,
    Mail,
    Shield,
    Key,
    Save,
    Trash2
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Lock },
        { id: "api", label: "API Keys", icon: Key },
    ];

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-[#07BB9C] bg-clip-text text-transparent mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your account preferences and security</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                            ? "bg-[#f66d32] text-white shadow-lg shadow-purple-100"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8">
                            {activeTab === "general" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <User className="w-5 h-5 text-purple-600" />
                                            General Preferences
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Language</label>
                                                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none bg-white/50">
                                                    <option>English (US)</option>
                                                    <option>Français</option>
                                                    <option>Español</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Timezone</label>
                                                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none bg-white/50">
                                                    <option>(GMT+01:00) Paris, Berlin, Rome</option>
                                                    <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                                    <option>(GMT+00:00) London, Lisbon, Casablanca</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Appearance</h3>
                                        <div className="flex gap-4">
                                            <button className="flex-1 p-4 rounded-2xl border-2 border-purple-600 bg-purple-50 text-center">
                                                <div className="w-full h-12 bg-white rounded-lg mb-2 shadow-sm border border-gray-100"></div>
                                                <span className="text-sm font-bold text-purple-700">Light</span>
                                            </button>
                                            <button className="flex-1 p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 text-center">
                                                <div className="w-full h-12 bg-gray-900 rounded-lg mb-2 shadow-sm"></div>
                                                <span className="text-sm font-bold text-gray-600">Dark</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-purple-600" />
                                        Notification Settings
                                    </h3>
                                    <div className="space-y-6">
                                        {[
                                            { title: "Execution Success", desc: "Get notified when a Zap runs successfully", enabled: true },
                                            { title: "Execution Failure", desc: "Get notified immediately when a Zap fails", enabled: true },
                                            { title: "Weekly Summary", desc: "Receive a weekly report of your automation performance", enabled: false },
                                            { title: "New Integrations", desc: "Be the first to know about new apps and features", enabled: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                                                <div>
                                                    <p className="font-bold text-gray-900">{item.title}</p>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <button className={`w-12 h-6 rounded-full transition-all relative ${item.enabled ? "bg-[#f66d32]" : "bg-gray-300"}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? "right-1" : "left-1"}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "security" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-purple-600" />
                                        Security & Privacy
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Change Password</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input type="password" placeholder="Current Password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none bg-white/50" />
                                                <input type="password" placeholder="New Password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none bg-white/50" />
                                                <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none bg-white/50" />
                                            </div>
                                            <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                                                Update Password
                                            </button>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100">
                                            <h4 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4">Danger Zone</h4>
                                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-red-900">Delete Account</p>
                                                    <p className="text-sm text-red-700">Once you delete your account, there is no going back.</p>
                                                </div>
                                                <button className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "api" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Key className="w-5 h-5 text-purple-600" />
                                        API Management
                                    </h3>
                                    <div className="p-6 rounded-2xl bg-[#f66d29]/10 border border-purple-100">
                                        <p className="text-sm text-[#f66d32] mb-4">
                                            Use these keys to authenticate your requests to the Area API. Keep them secret!
                                        </p>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-purple-700 uppercase">Public Key</label>
                                                <div className="flex gap-2">
                                                    <input readOnly value="pk_live_51Nz..." className="flex-1 px-4 py-2 rounded-lg border border-purple-200 bg-white font-mono text-sm" />
                                                    <button className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 font-bold text-sm">Copy</button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-purple-700 uppercase">Secret Key</label>
                                                <div className="flex gap-2">
                                                    <input readOnly type="password" value="sk_live_************************" className="flex-1 px-4 py-2 rounded-lg border border-purple-200 bg-white font-mono text-sm" />
                                                    <button className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 font-bold text-sm">Reveal</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-bold hover:border-purple-300 hover:text-purple-600 transition-all">
                                        + Generate New API Key
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
