import React, { useState, useEffect } from 'react';
import { GanttChartSquare, Layers, Clock, ShieldCheck, Zap, Info, AlertTriangle, ArrowDown, ArrowUp, Loader2 } from 'lucide-react';

const SEGMENTS = [
    { from: 'NDLS', to: 'CNB', km: 440, speed: 130 },
    { from: 'CNB', to: 'PRYJ', km: 195, speed: 130 },
    { from: 'PRYJ', to: 'DDU', km: 153, speed: 130 },
    { from: 'DDU', to: 'GAYA', km: 205, speed: 120 },
    { from: 'GAYA', to: 'DHN', km: 201, speed: 110 },
    { from: 'DHN', to: 'ASN', km: 59, speed: 120 },
    { from: 'ASN', to: 'HWH', km: 194, speed: 130 }
];

const LINES = [
    { dir: 'DOWN', label: 'DOWN Line', arrow: <ArrowDown className="w-3 h-3" />, toEast: '→' },
    { dir: 'UP', label: 'UP Line', arrow: <ArrowUp className="w-3 h-3" />, toEast: '←' }
];

const deptColors = {
    'Civil': { border: 'border-[#E7C365]', bg: 'bg-[#E7C365]/30', text: 'text-[#E7C365]', glow: 'shadow-[0_0_12px_rgba(231,195,101,0.25)]', dash: 'bg-[repeating-linear-gradient(135deg,#E7C365_0px,#E7C365_4px,transparent_4px,transparent_8px)]' },
    'OHE (Electrical)': { border: 'border-[#00E5FF]', bg: 'bg-[#00E5FF]/30', text: 'text-[#00E5FF]', glow: 'shadow-[0_0_12px_rgba(0,229,255,0.25)]', dash: 'bg-[repeating-linear-gradient(135deg,#00E5FF_0px,#00E5FF_4px,transparent_4px,transparent_8px)]' },
    'S&T (Signalling)': { border: 'border-[#FF00FF]', bg: 'bg-[#FF00FF]/30', text: 'text-[#FF00FF]', glow: 'shadow-[0_0_12px_rgba(255,0,255,0.25)]', dash: 'bg-[repeating-linear-gradient(135deg,#FF00FF_0px,#FF00FF_4px,transparent_4px,transparent_8px)]' }
};

const hours = Array.from({ length: 24 }, (_, i) => i);
const hourGrid = { display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' };

export default function GanttTab({ blocks }) {
    const [viewMode, setViewMode] = useState('integrated'); // 'integrated' or 'siloed'
    const [hoveredBlock, setHoveredBlock] = useState(null);
    const [rawRequests, setRawRequests] = useState(null);
    const [loadingRequests, setLoadingRequests] = useState(false);

    useEffect(() => {
        setLoadingRequests(true);
        fetch('/api/requests')
            .then((res) => res.json())
            .then((data) => setRawRequests(data.raw_requests || []))
            .catch((err) => console.warn('[AVAIL React] Requests fetch error:', err))
            .finally(() => setLoadingRequests(false));
    }, []);

    // Build the 14 realistic track rows (7 segments x DOWN/UP lines)
    const tracks = [];
    SEGMENTS.forEach((seg) => {
        LINES.forEach((line) => {
            tracks.push({
                id: `TRK-${seg.from}-${seg.to}-${line.dir}`,
                segment: `${seg.from}-${seg.to}`,
                line: line,
                length_km: seg.km,
                max_speed: seg.speed
            });
        });
    });

    const fmtTime = (m) => (m === undefined || m === null ? '--:--' : `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);

    // Normalize any maintenance window into a renderable bar
    const toBar = (it, isRaw) => ({
        block_id: it.block_id || it.request_id,
        segment: it.segment,
        track_affected: it.track_affected || 'BOTH',
        start_min: isRaw ? it.preferred_start_min : it.start_min,
        end_min: isRaw ? it.preferred_end_min : it.end_min,
        start_time_str: (isRaw ? it.preferred_start_time_str : it.start_time_str) || fmtTime(isRaw ? it.preferred_start_min : it.start_min),
        end_time_str: (isRaw ? it.preferred_end_time_str : it.end_time_str) || fmtTime(isRaw ? it.preferred_end_min : it.end_min),
        work_descriptions: it.work_descriptions ? it.work_descriptions : [it.work_type],
        department: isRaw ? (it.department || 'Civil') : (it.departments?.[0] || 'Civil'),
        hours_saved: it.hours_saved,
        predicted_delay_risk: it.predicted_delay_risk
    });

    const itemsFor = (track) => {
        if (viewMode === 'integrated') {
            return (blocks || [])
                .filter((b) => b.segment === track.segment)
                .map((b) => toBar(b, false));
        }
        return (rawRequests || [])
            .filter((r) => r.segment === track.segment)
            .map((r) => toBar(r, true));
    };

    const matchesLine = (bar, line) => {
        const ta = bar.track_affected;
        if (line.dir === 'DOWN') return ta === 'DOWN_LINE' || ta === 'DOWN' || ta === 'BOTH';
        return ta === 'UP_LINE' || ta === 'UP' || ta === 'BOTH';
    };

    const integratedCount = (blocks || []).length;
    const siloedCount = rawRequests ? rawRequests.length : 0;

    return (
        <div className="space-y-6">
            {/* Header Controls & Toggle */}
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
                            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'siloed'
                                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            Siloed Baseline ({siloedCount || '…'})
                        </button>
                        <button
                            onClick={() => setViewMode('integrated')}
                            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'integrated'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/25'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            AVAIL Integrated ({integratedCount})
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

            {/* Active-mode info strip */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono ${viewMode === 'integrated'
                    ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
                    : 'bg-pink-950/30 border-pink-500/30 text-pink-200'
                }`}>
                {viewMode === 'integrated' ? (
                    <>
                        <ShieldCheck className="w-4 h-4" />
                        AVAIL merged <strong>{siloedCount || '…'}</strong> siloed department requests into <strong>{integratedCount}</strong> unified corridor block window(s) on the shared track network.
                        {viewMode === 'siloed' ? null : <span className="text-cyan-300/80">Bars are placed on the exact line (DOWN/UP/BOTH) each department requested.</span>}
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-4 h-4" />
                        3 departments schedule independently — overlapping windows stack on the same line. Hover to see conflicting requests.
                    </>
                )}
            </div>

            {/* Main Realistic Gantt Grid */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 overflow-x-auto relative">
                <div className="min-w-[1050px] space-y-2">
                    {/* Time Header Grid (00 - 23 Hours) */}
                    <div className="flex border-b border-slate-800/80 pb-3 mb-2 font-mono text-[11px] text-slate-400">
                        <div className="w-52 shrink-0 font-bold uppercase tracking-wider text-slate-300">Track Segment & Line</div>
                        <div className="flex-1 text-center" style={hourGrid}>
                            {hours.map((h) => (
                                <div key={h} className="border-l border-slate-800/60 pl-1 text-left text-slate-500 font-semibold overflow-visible">
                                    {h.toString().padStart(2, '0')}:00
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Track Segment Rows */}
                    <div className="space-y-2">
                        {tracks.map((trk) => {
                            const segBlocks = itemsFor(trk).filter((b) => matchesLine(b, trk.line));
                            const downCount = trk.line.dir === 'DOWN';

                            return (
                                <div key={trk.id} className="flex items-start gap-0 py-1.5 hover:bg-slate-900/50 rounded-xl px-2 transition-all">
                                    {/* Track Label */}
                                    <div className="w-52 shrink-0 space-y-0.5 pr-2 pt-1.5">
                                        <div className="flex items-center gap-2 font-mono font-extrabold text-xs text-white">
                                            <span>{trk.segment}</span>
                                            {downCount ? <ArrowDown className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowUp className="w-3.5 h-3.5 text-blue-400" />}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-medium truncate">
                                            {trk.line.label} {trk.segment.split('-')[0]} {downCount ? '→' : '←'} {trk.segment.split('-')[1]} · {trk.length_km} km · {trk.max_speed} km/h
                                        </div>
                                    </div>

                                    {/* 24-Hour Timeline Grid Container */}
                                    <div className="flex-1 h-10 bg-slate-950/90 rounded-xl relative border border-slate-800/80 overflow-hidden">
                                        {/* Hour Vertical Grid Lines */}
                                        <div className="absolute inset-0 grid pointer-events-none" style={hourGrid}>
                                            {hours.map((h) => <div key={h} className="border-l border-slate-700/40"></div>)}
                                        </div>

                                        {/* Maintenance Windows Overlay */}
                                        {segBlocks.map((b, idx) => {
                                            const dept = b.department;
                                            const style = deptColors[dept] || deptColors['Civil'];
                                            const leftPct = ((b.start_min || 0) / 1440) * 100;
                                            const widthPct = Math.max((((b.end_min || b.start_min) - b.start_min) / 1440) * 100, 3);
                                            const topOff = viewMode === 'siloed' ? Math.min(idx, 2) * 9 : 0;

                                            return (
                                                <div
                                                    key={b.block_id}
                                                    style={{
                                                        left: `${leftPct}%`,
                                                        width: `${widthPct}%`,
                                                        top: `${6 + topOff}px`,
                                                        height: '22px'
                                                    }}
                                                    onMouseEnter={() => setHoveredBlock({ ...b, isRaw: viewMode === 'siloed' })}
                                                    onMouseLeave={() => setHoveredBlock(null)}
                                                    className={`absolute rounded-md border ${viewMode === 'siloed' ? 'border-dashed border-2' : 'border-2'} ${style.border} ${style.bg} ${style.text} ${style.glow} flex items-center justify-between px-1.5 text-[10px] font-mono font-bold transition-all hover:scale-[1.02] cursor-pointer z-10 shadow-lg`}
                                                    title={b.work_descriptions?.[0]}
                                                >
                                                    <span className="truncate">{b.block_id}</span>
                                                    <span className="opacity-80 hidden sm:inline">{b.start_time_str}</span>
                                                </div>
                                            );
                                        })}

                                        {segBlocks.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-slate-700 select-none pointer-events-none">
                                                NO {viewMode === 'siloed' ? 'DEPARTMENT' : 'MAINTENANCE'} WINDOW
                                            </div>
                                        )}
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
                                {hoveredBlock.segment} · {hoveredBlock.track_affected}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">{hoveredBlock.work_descriptions?.[0] || 'Integrated Maintenance'}</p>
                        <div className="space-y-1 text-slate-400 text-[11px]">
                            <div>🕐 Window: <strong className="text-white">{hoveredBlock.start_time_str} – {hoveredBlock.end_time_str}</strong></div>
                            {hoveredBlock.isRaw ? (
                                <div className="bg-pink-500/10 border border-pink-500/30 text-pink-300 px-2 py-1 rounded text-[10px]">
                                    Raw siloed request — NOT yet integrated with other departments
                                </div>
                            ) : (
                                <>
                                    <div>⚡ Hours Saved: <strong className="text-emerald-400">+{hoveredBlock.hours_saved || 0}h</strong></div>
                                    <div>⚠ Delay Risk: <strong className="text-amber-400">{(hoveredBlock.predicted_delay_risk || 0).toFixed(2)}</strong></div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend / footer hint */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-cyan-500" /> 14 track rows = 7 real segments × DOWN/UP lines</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-500" /> 24-h rolling timeline · solid = integrated, dashed = siloed</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-500" /> Hover any bar for the maintenance window & delay risk</span>
            </div>
            {loadingRequests && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading siloed baseline requests…
                </div>
            )}
        </div>
    );
}