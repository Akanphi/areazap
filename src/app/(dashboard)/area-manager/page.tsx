"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Zap,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Play,
    Pause,
    Copy,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Activity,
    ArrowUpDown,
    RefreshCw,
    Hash,
    Calendar
} from "lucide-react";
import { getAreas, Area, AreaStatus, deleteArea, updateArea } from "@/api/areas";
import AlertPop from "@/components/ui/AlertPop";
import ActionModal from "@/components/ui/ActionModal";
import AreaDetailsModal from "@/components/ui/AreaDetailsModal";

export default function ZapsManagerPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [areas, setAreas] = useState<Area[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<Area | null>(null);

    // Custom Alert and Modal state
    const [alertConfig, setAlertConfig] = useState<{ isVisible: boolean; message: string }>({
        isVisible: false,
        message: "",
    });
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
    });

    const showAlert = (message: string) => {
        setAlertConfig({ isVisible: true, message });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, isVisible: false }));
    };

    // Fetch data
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                setIsLoading(true);
                const data = await getAreas();
                setAreas(data);

                // Log each area details
                console.log("--- Fetched Areas Details ---");
                data.forEach((area, index) => {
                    console.log(`Area ${index + 1}:`, area);
                });
                console.log("-----------------------------");

                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch areas:", err);
                setError("Failed to load areas. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreas();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = () => setActiveDropdown(null);
        if (activeDropdown) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [activeDropdown]);

    // Filter and sort areas (unchanged logic, just context)
    const filteredAndSortedAreas = useMemo(() => {
        let filtered = areas;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(area =>
                area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (area.description && area.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(area => area.status === statusFilter as AreaStatus);
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "created":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case "executions":
                    return b.runs_count - a.runs_count;
                case "lastRun":
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                default:
                    return 0;
            }
        });

        return sorted;
    }, [areas, searchQuery, statusFilter, sortBy]);

    // Calculate statistics (unchanged logic)
    const stats = useMemo(() => {
        return {
            total: areas.length,
            active: areas.filter(a => a.status === AreaStatus.ACTIVE).length,
            paused: areas.filter(a => a.status === AreaStatus.DISABLED).length,
            inactive: areas.filter(a => a.status === AreaStatus.DRAFT).length,
            executions: areas.reduce((sum, a) => sum + a.runs_count, 0),
        };
    }, [areas]);

    const toggleAreaStatus = async (areaId: string, currentStatus: string) => {
        try {
            let newStatus: AreaStatus;
            if (currentStatus === AreaStatus.ACTIVE) {
                newStatus = AreaStatus.DISABLED;
            } else {
                newStatus = AreaStatus.ACTIVE;
            }

            const areaToUpdate = areas.find(a => a.id === areaId);
            if (!areaToUpdate) return;

            await updateArea(areaId, {
                name: areaToUpdate.name,
                status: newStatus,
                description: areaToUpdate.description,
                global_config: areaToUpdate.global_config
            });
            console.log(`Toggled status for ${areaId} to ${newStatus}`);

            // Update local state
            setAreas(prevAreas =>
                prevAreas.map(area =>
                    area.id === areaId
                        ? { ...area, status: newStatus }
                        : area
                )
            );
        } catch (err) {
            console.error("Failed to toggle area status:", err);
            showAlert("Failed to update area status. Please try again.");
        }
    };

    const handleAction = async (action: string, areaId: string) => {
        console.log(`Action: ${action} on area ${areaId}`);

        if (action === "delete") {
            setModalConfig({
                isOpen: true,
                title: "Confirm Deletion",
                message: "Are you sure you want to delete this area? This action cannot be undone.",
                onConfirm: async () => {
                    try {
                        await deleteArea(areaId);
                        console.log(`Deleted area ${areaId}`);
                        setAreas(prevAreas => prevAreas.filter(a => a.id !== areaId));
                        setModalConfig(prev => ({ ...prev, isOpen: false }));
                    } catch (err) {
                        console.error("Failed to delete area:", err);
                        showAlert("Failed to delete area. Please try again.");
                        setModalConfig(prev => ({ ...prev, isOpen: false }));
                    }
                }
            });
        } else if (action === "edit") {
            router.push(`/area-editor?id=${areaId}`);
        }
        // Implement other actions (duplicate) as needed
        setActiveDropdown(null);
    };

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
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-[#07BB9C] bg-clip-text text-transparent mb-2">
                                Area's Manager
                            </h1>
                            <p className="text-gray-600 text-lg">Manage and monitor your automation workflows</p>
                        </div>
                        <button
                            onClick={() => router.push('/area-editor')}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-linear-to-r from-slate-600 to-sky-400 cursor-pointer text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Area
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 lg:flex-none px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm font-medium"
                            >
                                <option value="all">All Status</option>
                                <option value={AreaStatus.ACTIVE}>Active</option>
                                <option value={AreaStatus.DISABLED}>Paused</option>
                                <option value={AreaStatus.DRAFT}>Draft</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 lg:flex-none px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm font-medium"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="created">Sort by Created</option>
                                <option value="executions">Sort by Executions</option>
                                <option value="lastRun">Sort by Last Run</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-purple-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-linear-to-br from-purple-100 via-purple-50 to-pink-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-purple-600 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                            {stats.total}
                        </h3>
                        <p className="text-sm text-gray-600 font-semibold">Total Zaps</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-emerald-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-linear-to-br from-emerald-100 via-green-50 to-teal-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mb-2">{stats.active}</h3>
                        <p className="text-sm text-gray-600 font-semibold">Active Zaps</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">
                            {stats.executions.toLocaleString()}
                        </h3>
                        <p className="text-sm text-gray-600 font-semibold">Total Executions</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-lg border-2 border-amber-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 sm:p-3.5 rounded-xl bg-linear-to-br from-[#1DD3C3]/20 via-[#00E5CC]/20 to-purple-100 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-extrabold text-amber-600 mb-2">
                            {stats.paused}
                        </h3>
                        <p className="text-sm text-gray-600 font-semibold">Paused Areas</p>
                    </div>
                </div>

                {/* Zaps Grid */}
                {isLoading ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading areas...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-red-100 p-8 sm:p-12 text-center">
                        <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error loading areas</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-600 to-sky-400 cursor-pointer text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                ) : filteredAndSortedAreas.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
                        <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No areas found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Get started by creating your first area"}
                        </p>
                        <button
                            onClick={() => router.push('/area-editor')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-slate-600 to-sky-400 cursor-pointer text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Area
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredAndSortedAreas.map((area) => (
                            <div
                                key={area.id}
                                onClick={() => setSelectedArea(area)}
                                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                            >
                                {/* Header with linear accent */}
                                <div className={`h-2 ${area.status === AreaStatus.ACTIVE
                                    ? 'bg-linear-to-r from-emerald-400 via-green-500 to-teal-500'
                                    : area.status === AreaStatus.DISABLED
                                        ? 'bg-linear-to-r from-[#1DD3C3] via-[#00E5CC] to-purple-400'
                                        : 'bg-linear-to-r from-orange-500 from- via-sky-900 via-'
                                    }`} />

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1DD3C3] transition-colors leading-tight">
                                                {area.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {area.description || "No description provided"}
                                            </p>
                                        </div>
                                        <div className="relative ml-2 flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === area.id ? null : area.id);
                                                }}
                                                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                                            >
                                                <MoreVertical className="w-5 h-5 text-gray-500" />
                                            </button>
                                            {activeDropdown === area.id && (
                                                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 w-48 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAction("edit", area.id);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-3 transition-colors font-medium"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Edit Area
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAction("duplicate", area.id);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors font-medium"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        Duplicate
                                                    </button>
                                                    <div className="h-px bg-gray-200 my-1.5 mx-2" />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAction("delete", area.id);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-colors font-medium"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2 mb-5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusColor(
                                                area.status || AreaStatus.DRAFT
                                            )} shadow-sm`}
                                        >
                                            {getStatusIcon(area.status || AreaStatus.DRAFT)}
                                            {(area.status || AreaStatus.DRAFT).charAt(0).toUpperCase() + (area.status || AreaStatus.DRAFT).slice(1)}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b-2 border-gray-100">
                                        <div className="flex items-start gap-3 bg-linear-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
                                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                                <Hash className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-600 mb-1 font-medium">Total Runs</p>
                                                <p className="text-lg font-bold text-gray-900 truncate">
                                                    {area.runs_count.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-linear-to-br from-purple-50 to-pink-50 p-3 rounded-xl">
                                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                                <Calendar className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-600 mb-1 font-medium">Created</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {formatDate(area.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-medium">Updated {formatDate(area.updated_at)}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAreaStatus(area.id, area.status || AreaStatus.DRAFT);
                                            }}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-sm ${(area.status || AreaStatus.DRAFT) === AreaStatus.ACTIVE
                                                ? "bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                                : "bg-gray-300 hover:bg-gray-400"
                                                } hover:shadow-md active:scale-95`}
                                            title={(area.status || AreaStatus.DRAFT) === AreaStatus.ACTIVE ? "Click to disable" : "Click to enable"}
                                        >
                                            <span
                                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${area.status === AreaStatus.ACTIVE ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Alert and Modal */}
            <AlertPop
                isVisible={alertConfig.isVisible}
                message={alertConfig.message}
                onClose={hideAlert}
            />
            <ActionModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type="warning"
                onConfirm={modalConfig.onConfirm}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                confirmText="Supprimer"
            />
            <AreaDetailsModal
                isOpen={!!selectedArea}
                onClose={() => setSelectedArea(null)}
                area={selectedArea}
            />
        </div>
    );
}