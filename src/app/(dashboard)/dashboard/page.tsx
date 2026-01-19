"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area as RechartsArea } from "recharts";
import { Zap, Activity, CheckCircle, Clock, TrendingUp, Filter, Eye, ArrowUpRight, ArrowDownRight, PlayCircle, RefreshCw } from "lucide-react";
import { getAreas, Area, AreaStatus } from "@/api/areas";
import { getAreaRuns, AreaRun, AreaRunStatus } from "@/api/areaRuns";

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("12M");
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaRuns, setAreaRuns] = useState<AreaRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch areas first
        const areasData = await getAreas();
        setAreas(areasData);

        // Try to fetch area runs, but don't fail if it errors
        try {
          const runsData = await getAreaRuns();
          setAreaRuns(runsData);
        } catch (runsError) {
          console.warn("Failed to fetch area runs (using empty array):", runsError);
          setAreaRuns([]);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Rate') ? `${entry.value}%` : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Calculated Metrics ---

  const metrics = useMemo(() => {
    const totalZaps = areas.length;
    const activeZaps = areas.filter(a => a.status === AreaStatus.ACTIVE).length;
    const totalExecutions = areaRuns.length;

    const successfulRuns = areaRuns.filter(r => r.status === AreaRunStatus.SUCCESS).length;
    const successRate = totalExecutions > 0 ? ((successfulRuns / totalExecutions) * 100).toFixed(1) : "0.0";

    // Calculate Average Execution Time
    let totalTimeMs = 0;
    let timedRunsCount = 0;
    areaRuns.forEach(run => {
      if (run.started_at && run.finished_at) {
        const start = new Date(run.started_at).getTime();
        const end = new Date(run.finished_at).getTime();
        const duration = end - start;
        if (duration >= 0) {
          totalTimeMs += duration;
          timedRunsCount++;
        }
      }
    });
    const avgExecutionTime = timedRunsCount > 0 ? (totalTimeMs / timedRunsCount / 1000).toFixed(2) : "0.00";

    return {
      totalZaps,
      activeZaps,
      totalExecutions,
      successRate,
      avgExecutionTime
    };
  }, [areas, areaRuns]);

  const executionTimeline = useMemo(() => {
    const months: Record<string, { executions: number, successful: number }> = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short' });
      months[key] = { executions: 0, successful: 0 };
    }

    areaRuns.forEach(run => {
      const date = new Date(run.created_at);
      const key = date.toLocaleString('default', { month: 'short' });
      if (months[key]) {
        months[key].executions++;
        if (run.status === AreaRunStatus.SUCCESS) {
          months[key].successful++;
        }
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      executions: data.executions,
      successful: data.successful
    }));
  }, [areaRuns]);

  const executionsByApp = useMemo(() => {
    const appCounts: Record<string, number> = {};

    // Use runs_count from areas instead of fetching area runs
    areas.forEach(area => {
      if (area.triggers.length > 0) {
        const service = area.triggers[0].external_service;
        appCounts[service] = (appCounts[service] || 0) + (area.runs_count || 0);
      }
    });

    const total = Object.values(appCounts).reduce((sum, count) => sum + count, 0);
    const colors = ["#fc6d26", "#00B1B0", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"];

    return Object.entries(appCounts)
      .map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : "0",
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [areas]);

  const zapsByCategory = useMemo(() => {
    const categoryCounts: Record<string, { count: number, executions: number }> = {};
    const total = areas.length;

    areas.forEach(area => {
      if (area.triggers.length > 0) {
        const service = area.triggers[0].external_service;
        if (!categoryCounts[service]) {
          categoryCounts[service] = { count: 0, executions: 0 };
        }
        categoryCounts[service].count++;
        categoryCounts[service].executions += area.runs_count;
      }
    });

    const colors = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
    return Object.entries(categoryCounts)
      .map(([name, data], index) => ({
        name,
        count: data.count,
        executions: data.executions,
        percentage: total > 0 ? ((data.count / total) * 100).toFixed(1) : "0",
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [areas]);

  const topPerformers = useMemo(() => {
    return [...areas]
      .sort((a, b) => b.runs_count - a.runs_count)
      .slice(0, 5)
      .map(area => {
        // Calculate success rate for this specific area
        const areaSpecificRuns = areaRuns.filter(r => r.area_id === area.id);
        const successCount = areaSpecificRuns.filter(r => r.status === AreaRunStatus.SUCCESS).length;
        const rate = areaSpecificRuns.length > 0 ? (successCount / areaSpecificRuns.length) * 100 : 0;

        // Calculate avg time for this area
        let totalTime = 0;
        let count = 0;
        areaSpecificRuns.forEach(r => {
          if (r.started_at && r.finished_at) {
            const dur = new Date(r.finished_at).getTime() - new Date(r.started_at).getTime();
            if (dur >= 0) {
              totalTime += dur;
              count++;
            }
          }
        });
        const avgTime = count > 0 ? (totalTime / count / 1000).toFixed(2) : "0.00";

        return {
          name: area.name,
          category: area.triggers[0]?.external_service || "Unknown",
          status: area.status,
          executions: area.runs_count,
          successRate: rate.toFixed(1),
          avgTime,
          logo: area.triggers[0]?.external_service?.substring(0, 2).toUpperCase() || "NA",
          trend: rate >= 50 ? 'up' : 'down' // Simple logic for now
        };
      });
  }, [areas, areaRuns]);

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const totos = zapsByCategory.reduce(
    (acc, aris) => acc + aris.executions,
    0
  );
  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
        <div className="text-center">
          <Activity className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-sky-400 cursor-pointer text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-[#1A4B9E] bg-clip-text text-transparent mb-2">
            Area Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Monitor your automation workflows and performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {metrics.totalZaps}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Total Areas</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                {metrics.activeZaps} Active
              </span>
            </div>
            <h3 className="text-3xl font-bold text-green-600">
              {totos}
            </h3>
            <p className="text-sm text-gray-600 font-medium">Total Executions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-blue-600">
              {metrics.successRate}%
            </h3>
            <p className="text-sm text-gray-600 font-medium">Success Rate</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-[#1DD3C3]/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-[#1DD3C3]/10">
                <Clock className="w-6 h-6 text-[#1DD3C3]" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[#1DD3C3]">
              {metrics.avgExecutionTime}s
            </h3>
            <p className="text-sm text-gray-600 font-medium">Avg Execution Time</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100">
                <Activity className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                Live
              </span>
            </div>
            <h3 className="text-3xl font-bold text-rose-600">
              {formatNumber(executionTimeline[executionTimeline.length - 1]?.executions || 0)}
            </h3>
            <p className="text-sm text-gray-600 font-medium">This Month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Execution Timeline */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Execution Timeline</h3>
              <div className="flex items-center gap-2">
                <button className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                  6M
                </button>
                <button
                  className="text-xs px-3 py-1 rounded-full border transition-colors"
                  style={{
                    backgroundColor: selectedTimeRange === '12M' ? '#C174F2' : 'transparent',
                    color: selectedTimeRange === '12M' ? 'white' : '#6B7280',
                    borderColor: selectedTimeRange === '12M' ? '#C174F2' : '#D1D5DB'
                  }}
                >
                  12M
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={executionTimeline}>
                <defs>
                  <linearGradient id="executionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C174F2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C174F2" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="successfulGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <RechartsArea
                  type="monotone"
                  dataKey="executions"
                  stroke="#C174F2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#executionsGradient)"
                  name="Total Executions"
                />
                <RechartsArea
                  type="monotone"
                  dataKey="successful"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#successfulGradient)"
                  name="Successful"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Executions by Service */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Executions by Service</h3>
            {executionsByApp.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={executionsByApp}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const dataEntry = executionsByApp.find(item => item.name === entry.name);
                      return dataEntry ? `${dataEntry.name}: ${dataEntry.percentage}%` : '';
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {executionsByApp.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => {
                      const v = typeof value === "number" ? value : 0;
                      return [formatNumber(v), "Executions"] as const;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => `${value} (${entry.payload.percentage}%)`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>No execution data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Zaps Overview */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Areas Overview</h3>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Eye className="w-4 h-4" />
                  View All
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zaps by Category */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Area by Category</h4>
                <div className="space-y-3">
                  {zapsByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50/30 hover:shadow-md transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{category.name}</p>
                          <p className="text-sm text-gray-600">{category.count} zaps • {formatNumber(category.executions)} executions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Zaps */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Top Performing Zaps</h4>
                <div className="space-y-3">
                  {topPerformers.map((zap, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-green-50/30 hover:shadow-md transition-all duration-300 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#1DD3C3] flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {zap.logo}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{zap.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{zap.category} • {zap.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold text-sm ${parseFloat(zap.successRate) >= 98 ? 'text-green-600' : 'text-[#1DD3C3]'}`}>
                            {zap.successRate}%
                          </span>
                          {zap.trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-[#1DD3C3]" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{formatNumber(zap.executions)} runs • {zap.avgTime}s avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}