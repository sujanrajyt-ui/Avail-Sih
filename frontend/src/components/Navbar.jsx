import React from 'react';
import { Bot, RefreshCw, LayoutDashboard, Cpu, GanttChartSquare, BookOpen, Gamepad2, Play, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOptimizing, onReoptimize, onStartDemo, onOpenSandbox, theme, onToggleTheme }) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pipeline', label: 'AI Pipeline & Twin', icon: Cpu },
        { id: 'gantt', label: 'Corridor Gantt & Map', icon: GanttChartSquare },
        { id: 'audit', label: 'Audit & Reports', icon: BookOpen }
    ];

    return (
        <header className="bg-[#0B0F19]/95 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                    <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-extrabold text-base text-white tracking-tight">AVAIL</h1>
                        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                            SIH26027
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Automatic Block Planning Engine</p>
                </div>
            </div>

            {/* Clean 4-Tab Navigation (Hick's Law) */}
            <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id || (activeTab === 'twin' && tab.id === 'pipeline') || (activeTab === 'map' && tab.id === 'gantt') || (activeTab === 'reports' && tab.id === 'audit');
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Primary Action Buttons & Theme Toggle */}
            <div className="flex items-center gap-2">
                {/* Sun/Moon Theme Toggle */}
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold"
                    title="Toggle Light / Dark Theme Mode"
                >
                    {theme === 'light' ? (
                        <>
                            <Moon className="w-4 h-4 text-indigo-400" />
                            <span className="hidden sm:inline">Dark</span>
                        </>
                    ) : (
                        <>
                            <Sun className="w-4 h-4 text-amber-400" />
                            <span className="hidden sm:inline">Light</span>
                        </>
                    )}
                </button>

                <button
                    onClick={onOpenSandbox}
                    className="flex items-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                    <Gamepad2 className="w-4 h-4 text-purple-400" />
                    <span>Judge Sandbox</span>
                </button>

                <button
                    onClick={onStartDemo}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                >
                    <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                    <span>Guided Tour</span>
                </button>

                <button
                    onClick={onReoptimize}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}</span>
                </button>
            </div>
        </header>
    );
}
