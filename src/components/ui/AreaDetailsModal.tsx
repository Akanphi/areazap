import React from 'react';
import { X, Zap, Play, Clock, Calendar, Hash, CheckCircle, Edit, Activity, Pause } from 'lucide-react';
import { Area, AreaStatus } from '@/api/areas';

interface AreaDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    area: Area | null;
}

export default function AreaDetailsModal({ isOpen, onClose, area }: AreaDetailsModalProps) {
    React.useEffect(() => {
        if (isOpen && area) {
            console.log("--- Selected Area Details ---");
            console.log(area);
            console.log("-----------------------------");
        }
    }, [isOpen, area]);

    if (!isOpen || !area) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case AreaStatus.ACTIVE:
                return "bg-green-100 text-green-700 border-green-200";
            case AreaStatus.DISABLED:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case AreaStatus.DRAFT:
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case AreaStatus.ACTIVE:
                return <CheckCircle className="w-3 h-3" />;
            case AreaStatus.DISABLED:
                return <Clock className="w-3 h-3" />;
            case AreaStatus.DRAFT:
                return <Edit className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{area.name}</h2>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(area.status)}`}>
                                {getStatusIcon(area.status)}
                                {area.status.charAt(0).toUpperCase() + area.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Created {formatDate(area.created_at)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {area.description || "No description provided."}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-1 text-blue-700 font-medium">
                                <Activity className="w-4 h-4" />
                                Total Runs
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{area.runs_count}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 mb-1 text-purple-700 font-medium">
                                <Clock className="w-4 h-4" />
                                Last Updated
                            </div>
                            <p className="text-sm font-bold text-purple-900 mt-1">{formatDate(area.updated_at)}</p>
                        </div>
                    </div>

                    {/* Triggers & Actions */}
                    <div className="space-y-6">
                        {/* Triggers */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-600" />
                                Triggers
                            </h3>
                            <div className="space-y-3">
                                {area.triggers.length > 0 ? (
                                    area.triggers.map((trigger) => (
                                        <div key={trigger.id} className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Zap className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{trigger.type}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-500">Service:</span>
                                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                                            <img
                                                                src={`/${trigger.external_service}.svg`}
                                                                alt={trigger.external_service}
                                                                className="w-4 h-4 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                            <span className="font-medium text-gray-700 capitalize text-sm">{trigger.external_service}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Config Display */}
                                            {trigger.config && Object.keys(trigger.config).length > 0 && (
                                                <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</p>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {Object.entries(trigger.config).map(([key, value]) => (
                                                            <div key={key} className="flex items-start gap-2">
                                                                <span className="text-gray-600 font-medium min-w-[100px]">{key}:</span>
                                                                <span className="text-gray-900 break-all">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic text-sm">No triggers configured.</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Play className="w-4 h-4 text-emerald-600" />
                                Actions
                            </h3>
                            <div className="space-y-3">
                                {area.actions.length > 0 ? (
                                    area.actions.map((action) => (
                                        <div key={action.id} className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-emerald-100 rounded-lg">
                                                    <Play className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{action.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-sm text-gray-500">Service:</span>
                                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                                            <img
                                                                src={`/${action.external_service}.svg`}
                                                                alt={action.external_service}
                                                                className="w-4 h-4 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                            <span className="font-medium text-gray-700 capitalize text-sm">{action.external_service}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1 font-mono">{action.action_type}</p>
                                                </div>
                                            </div>
                                            {/* Config Display */}
                                            {action.config && Object.keys(action.config).length > 0 && (
                                                <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm border border-gray-100">
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Configuration</p>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {Object.entries(action.config).map(([key, value]) => (
                                                            <div key={key} className="flex items-start gap-2">
                                                                <span className="text-gray-600 font-medium min-w-[100px]">{key}:</span>
                                                                <span className="text-gray-900 break-all">{String(value)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic text-sm">No actions configured.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
