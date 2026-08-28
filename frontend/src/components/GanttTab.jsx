import React, { useState } from 'react';
import { GanttChartSquare, Layers, Clock, ShieldCheck, Zap, Info, AlertTriangle } from 'lucide-react';

export default function GanttTab({ blocks }) {
    const [viewMode, setViewMode] = useState('integrated'); // 'integrated' or 'siloed'
    const [hoveredBlock, setHoveredBlock] = useState(null);

    const deptColors = {
        'Civil': { border: 'border-[#E7C365]', bg: 'bg-[#E7C365]/20', text: 'text-[#E7C365]', glow: 'shadow-[0_0_12px_rgba(231,195,101,0.25)]' },
        'OHE (Electrical)': { border: 'border-[#00E5FF]', bg: 'bg-[#00E5FF]/20', text: 'text-[#00E5FF]', glow: 'shadow-[0_0_12px_rgba(0,229,255,0.25)]' },
        'S&T (Signalling)': { border: 'border-[#FF00FF]', bg: 'bg-[#FF00FF]/20', text: 'text-[#FF00FF]', glow: 'shadow-[0_0_12px_rgba(255,0,255,0.25)]' }
    };

    const tracks = [
        { id: 'NDLS-CNB-DN', segment: 'NDLS-CNB', line: 'DOWN Line (Fast Freight)' },
        { id: 'NDLS-CNB-UP', segment: 'NDLS-CNB', line: 'UP Line (Pass Express)' },
        { id: 'CNB-PRYJ-DN', segment: 'CNB-PRYJ', line: 'DOWN Line' },
        { id: 'CNB-PRYJ-UP', segment: 'CNB-PRYJ', line: 'UP Line' },
        { id: 'PRYJ-DDU-DN', segment: 'PRYJ-DDU', line: 'DOWN Line' },
        { id: 'DDU-GAYA-DN', segment: 'DDU-GAYA', line: 'DOWN Line' },
        { id: 'GAYA-DHN-DN', segment: 'GAYA-DHN', line: 'DOWN Line' },
        { id: 'DHN-ASN-DN', segment: 'DHN-ASN', line: 'DOWN Line' },
        { id: 'ASN-HWH-DN', segment: 'ASN-HWH', line: 'DOWN Line' }
    ];

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="space-y-6">
            {/* Header Controls & Toggle (Page 3 Simulation Canvas) */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <GanttChartSquare className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-base font-extrabold text-white">Realistic Corridor Gantt Canvas</h2>
                    </div>

                    {/* Siloed Baseline vs AVAIL Integrated Toggle */}
                    <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 font-mono text-xs">
                        <button
                            onClick={() => setViewMode('siloed')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${viewMode === 'siloed'
                                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Siloed Baseline (Isolated Blocks)
                        </button>
                        <button
                            onClick={() => setViewMode('integrated')}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'integrated'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            AVAIL Integrated Plan (Cross-Department)
                        </button>
                    </div>
                </div>

                {/* Department Legend */}
                <div className="flex items-center gap-5 text-xs font-semibold bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#E7C365] shadow-[0_0_8px_rgba(231,195,101,0.5)]"></span>
                        <span className="text-[#E7C365]">Civil</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]"></span>
                        <span className="text-[#00E5FF]">OHE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-[#FF00FF] shadow-[0_0_8px_rgba(255,0,255,0.5)]"></span>
                        <span className="text-[#FF00FF]">S&T</span>
                    </div>
                </div>
            </div>

            {/* Main Realistic Gantt Grid */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 overflow-x-auto relative">
                <div className="min-w-[1000px] space-y-2">
                    {/* Time Header Grid (00 - 23 Hours) */}
                    <div className="flex border-b border-slate-800/80 pb-3 mb-2 font-mono text-[11px] text-slate-400">
                        <div className="w-48 shrink-0 font-bold uppercase tracking-wider text-slate-300">Track Segment & Line</div>
                        <div className="flex-1 grid grid-cols-24 gap-0 text-center">
                            {hours.map((h) => (
                                <div key={h} className="border-l border-slate-800/60 pl-1 text-left text-slate-500 font-semibold">
                                    {h.toString().padStart(2, '0')}:00
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Track Segment Rows */}
                    <div className="space-y-2.5">
                        {tracks.map((trk) => {
                            const segBlocks = blocks.filter((b) => b.segment === trk.segment);

                            return (
                                <div key={trk.id} className="flex items-center gap-0 py-1.5 hover:bg-slate-900/50 rounded-xl px-2 transition-all">
                                    {/* Track Label */}
                                    <div className="w-48 shrink-0 space-y-0.5 pr-2">
                                        <div className="font-mono font-extrabold text-xs text-white">{trk.segment}</div>
                                        <div className="text-[10px] text-slate-400 font-medium truncate">{trk.line}</div>
                                    </div>

                                    {/* 24-Hour Timeline Grid Container */}
                                    <div className="flex-1 h-9 bg-slate-950/90 rounded-xl relative border border-slate-800/80 overflow-hidden flex items-center">
                                        {/* Hour Vertical Grid Lines */}
                                        <div className="absolute inset-0 grid grid-cols-24 pointer-events-none opacity-20 divide-x divide-slate-700">
                                            {hours.map((h) => <div key={h}></div>)}
                                        </div>

                                        {/* Maintenance Blocks Overlay */}
                                        {segBlocks.map((b) => {
                                            const dept = b.departments?.[0] || 'Civil';
                                            const style = deptColors[dept] || deptColors['Civil'];
                                            const leftPct = (b.start_min / 1440) * 100;
                                            const widthPct = Math.max(((b.end_min - b.start_min) / 1440) * 100, 5);

                                            return (
                                                <div
                                                    key={b.block_id}
                                                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                                    onMouseEnter={() => setHoveredBlock(b)}
                                                    onMouseLeave={() => setHoveredBlock(null)}
                                                    className={`absolute h-7 rounded-lg border-2 ${style.border} ${style.bg} ${style.text} ${style.glow} flex items-center justify-between px-2.5 text-xs font-mono font-bold transition-all hover:scale-[1.02] cursor-pointer z-10 shadow-lg`}
                                                >
                                                    <span className="truncate">{b.block_id}</span>
                                                    <span className="text-[10px] opacity-90 hidden sm:inline">{b.start_time_str}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hover Tooltip (Realistic Interactive Inspector) */}
                {hoveredBlock && (
                    <div className="fixed bottom-6 right-6 z-50 glass-card p-4 rounded-2xl border border-cyan-500/40 shadow-2xl bg-slate-950/95 max-w-sm space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="font-extrabold text-cyan-400">{hoveredBlock.block_id}</span>
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px]">
                                {hoveredBlock.segment}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">{hoveredBlock.work_descriptions?.[0] || 'Integrated Maintenance'}</p>
                        <div className="space-y-1 text-slate-400 text-[11px]">
                            <div>⏱ Window: <strong className="text-white">{hoveredBlock.start_time_str} – {hoveredBlock.end_time_str}</strong></div>
                            <div>⚡ Hours Saved: <strong className="text-emerald-400">+{hoveredBlock.hours_saved}h</strong></div>
                            <div>⚠ Delay Risk: <strong className="text-amber-400">{(hoveredBlock.predicted_delay_risk || 0.35).toFixed(2)}</strong></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
