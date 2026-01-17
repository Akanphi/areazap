"use client";

import { useState } from "react";
import {
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from "lucide-react";

// Mock data for logs
const MOCK_LOGS = [
    { id: "1", zapName: "Daily Sales Report", status: "success", executionTime: "0.8s", date: "2024-03-15 09:00:02", details: "Successfully synced 42 rows to Google Sheets" },
    { id: "2", zapName: "Customer Onboarding", status: "success", executionTime: "1.2s", date: "2024-03-15 08:45:10", details: "Created contact in Salesforce and sent welcome email" },
    { id: "3", zapName: "Invoice Processing", status: "error", executionTime: "2.5s", date: "2024-03-15 08:30:00", details: "Failed to parse PDF: Invalid format" },
    { id: "4", zapName: "Support Ticket Alert", status: "success", executionTime: "0.5s", date: "2024-03-15 08:15:22", details: "Notification sent to #support-alerts" },
    { id: "5", zapName: "Lead Capture", status: "success", executionTime: "1.1s", date: "2024-03-15 08:00:05", details: "New lead added to HubSpot" },
    { id: "6", zapName: "Daily Sales Report", status: "success", executionTime: "0.9s", date: "2024-03-14 09:00:01", details: "Successfully synced 38 rows to Google Sheets" },
    { id: "7", zapName: "Slack Notification", status: "error", executionTime: "1.5s", date: "2024-03-14 08:50:00", details: "Slack API returned 401: Unauthorized" },
    { id: "8", zapName: "GitHub to Discord", status: "success", executionTime: "0.7s", date: "2024-03-14 08:40:12", details: "New PR notification sent to Discord" },
];

export default function LogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredLogs = MOCK_LOGS.filter(log => {
        const matchesSearch = log.zapName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.details.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-[#07BB9C] bg-clip-text text-transparent mb-2">
                        Activity Logs
                    </h1>
                    <p className="text-gray-600 text-lg">Monitor your automation executions and history</p>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white/50 text-sm font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="error">Error</option>
                        </select>
                        <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Zap Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Execution Time</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-purple-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{log.zapName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'success'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.status === 'success' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {log.executionTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {log.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {log.details}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-purple-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLogs.length}</span> of <span className="font-medium">{filteredLogs.length}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
