import React from 'react';
import { GanttChartSquare, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function GanttTab({ blocks }) {
    const deptColors = {
        'Civil': { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-300' },
        'OHE (Electrical)': { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-300' },
        'S&T (Signalling)': { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-300' }
    };

    const segments = ['NDLS-CNB', 'CNB-PRYJ', 'PRYJ-DDU', 'DDU-GAYA', 'GAYA-DHN', 'DHN-ASN', 'ASN-HWH'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="space-y-6">
            {/* Header Banner & Legend */}
            <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
                <div>
                    <div className="flex items-center gap-2">
                        <GanttChartSquare className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-base font-bold text-white">Interactive Corridor Gantt Chart</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                        24-hour visual schedule grid across the 1,447 km New Delhi – Howrah Corridor.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-400"></span>
                        <span className="text-amber-300">Civil (Track)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-cyan-500 border border-cyan-400"></span>
                        <span className="text-cyan-300">OHE (Electrical)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-pink-500 border border-pink-400"></span>
                        <span className="text-pink-300">S&T (Signalling)</span>
                    </div>
                </div>
            </div>

            {/* Main Gantt Grid */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 overflow-x-auto space-y-4">
                {/* Time Header */}
                <div className="min-w-[900px]">
                    <div className="flex border-b border-slate-800 pb-3 mb-2 font-mono text-[11px] text-slate-400">
                        <div className="w-36 font-bold uppercase tracking-wider shrink-0 text-slate-300">Corridor Segment</div>
                        <div className="flex-1 grid grid-cols-24 gap-1 text-center">
                            {hours.map((h) => (
                                <span key={h} className="text-slate-500 font-semibold">{h.toString().padStart(2, '0')}</span>
                            ))}
                        </div>
                    </div>

                    {/* Rows per Segment */}
                    <div className="space-y-3">
                        {segments.map((seg) => {
                            const segBlocks = blocks.filter((b) => b.segment === seg);

                            return (
                                <div key={seg} className="flex items-center gap-2 py-2 border-b border-slate-800/60 hover:bg-slate-900/40 rounded-xl px-2 transition-all">
                                    <div className="w-34 font-mono font-bold text-xs text-white shrink-0">{seg}</div>
                                    <div className="flex-1 h-10 bg-slate-950/80 rounded-xl relative border border-slate-800/80 overflow-hidden flex items-center">
                                        {/* Background hour grid lines */}
                                        <div className="absolute inset-0 grid grid-cols-24 pointer-events-none opacity-20 divide-x divide-slate-700">
                                            {hours.map((h) => <div key={h}></div>)}
                                        </div>

                                        {/* Maintenance Blocks on this Segment */}
                                        {segBlocks.map((b) => {
                                            const dept = b.departments?.[0] || 'Civil';
                                            const style = deptColors[dept] || deptColors['Civil'];
                                            const leftPct = (b.start_min / 1440) * 100;
                                            const widthPct = Math.max(((b.end_min - b.start_min) / 1440) * 100, 4);

                                            return (
                                                <div
                                                    key={b.block_id}
                                                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                                    className={`absolute h-7 rounded-lg border ${style.border} ${style.bg} ${style.text} flex items-center px-2 text-[11px] font-mono font-bold truncate transition-all hover:scale-[1.02] cursor-pointer shadow-md z-10`}
                                                    title={`${b.block_id}: ${b.work_descriptions?.[0] || 'Maintenance'} (${b.start_time_str} - ${b.end_time_str})`}
                                                >
                                                    <span className="truncate">{b.block_id}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
