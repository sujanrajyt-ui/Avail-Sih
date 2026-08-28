import React from 'react';
import { Bot, RefreshCw, LayoutDashboard, Cpu, Network, GanttChartSquare, Sliders, FileSpreadsheet, ShieldCheck, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOptimizing, onReoptimize }) {
    const tabs = [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'pipeline', label: 'Box 2: ML Pipeline', icon: Cpu },
        { id: 'twin', label: 'Box 3: Digital Twin Graph', icon: Network },
        { id: 'gantt', label: 'Box 5: Corridor Gantt', icon: GanttChartSquare },
        { id: 'simulation', label: 'What-If Simulator', icon: Sliders },
        { id: 'audit', label: 'CAG Research & Audit', icon: BookOpen },
        { id: 'reports', label: 'Requests & Export', icon: FileSpreadsheet }
    ];

    return (
        <header className="bg-[#0F172A]/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            {/* Brand & System Status */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                    <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                        <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-extrabold text-lg text-white tracking-tight">AVAIL</h1>
                        <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                            SIH26027 • Team Durga Ghee Podi Dosa
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Automatic Block Planning — NDLS-HWH 1,447 km Corridor</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold shadow-md shadow-cyan-500/25'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Action Button (Fitts's Law) */}
            <div className="flex items-center gap-3">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>0 Track Collisions Guaranteed</span>
                </div>
                <button
                    onClick={onReoptimize}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? 'AI Optimizing...' : 'Run Auto-Optimizer'}</span>
                </button>
            </div>
        </header>
    );
}
