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
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-xl px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-200 font-extrabold">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">AVAIL</h1>
                        <span className="text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
                            SIH26027
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Automatic Block Planning Engine</p>
                </div>
            </div>

            {/* Clean 4-Tab Navigation */}
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id || (activeTab === 'twin' && tab.id === 'pipeline') || (activeTab === 'map' && tab.id === 'gantt') || (activeTab === 'reports' && tab.id === 'audit');
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isActive
                                ? 'bg-sky-600 text-white font-extrabold shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold"
                    title="Toggle Light / Dark Theme Mode"
                >
                    {theme === 'light' ? (
                        <>
                            <Moon className="w-4 h-4 text-indigo-600" />
                            <span className="hidden sm:inline">Dark</span>
                        </>
                    ) : (
                        <>
                            <Sun className="w-4 h-4 text-amber-500" />
                            <span className="hidden sm:inline">Light</span>
                        </>
                    )}
                </button>

                <button
                    onClick={onOpenSandbox}
                    className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                >
                    <Gamepad2 className="w-4 h-4 text-purple-600" />
                    <span>Judge Sandbox</span>
                </button>

                <button
                    onClick={onStartDemo}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                >
                    <Play className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
                    <span>Guided Tour</span>
                </button>

                <button
                    onClick={onReoptimize}
                    disabled={isOptimizing}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}</span>
                </button>
            </div>
        </header>
    );
}

