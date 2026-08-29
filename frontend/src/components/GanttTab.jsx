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
    'Civil': { border: 'border-amber-400', bg: 'bg-amber-100', text: 'text-amber-900', glow: 'shadow-sm' },
    'OHE (Electrical)': { border: 'border-sky-400', bg: 'bg-sky-100', text: 'text-sky-900', glow: 'shadow-sm' },
    'S&T (Signalling)': { border: 'border-purple-400', bg: 'bg-purple-100', text: 'text-purple-900', glow: 'shadow-sm' }
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
            <div className="glass-card rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <GanttChartSquare className="w-5 h-5 text-sky-600" />
                        <h2 className="text-base font-extrabold text-slate-900">Realistic Corridor Gantt Canvas</h2>
                    </div>

                    {/* Siloed Baseline vs AVAIL Integrated Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 font-mono text-xs">
                        <button
                            onClick={() => setViewMode('siloed')}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'siloed'
                                ? 'bg-pink-100 text-pink-900 border border-pink-300 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Siloed Baseline ({siloedCount || '…'})
                        </button>
                        <button
                            onClick={() => setViewMode('integrated')}
                            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${viewMode === 'integrated'
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            AVAIL Integrated ({integratedCount})
                        </button>
                    </div>
                </div>

                {/* Department Legend */}
                <div className="flex items-center gap-5 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-amber-400"></span>
                        <span className="text-amber-900 font-bold">Civil</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-sky-400"></span>
                        <span className="text-sky-900 font-bold">OHE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-purple-400"></span>
                        <span className="text-purple-900 font-bold">S&T</span>
                    </div>
                </div>
            </div>

            {/* Active-mode info strip */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-medium ${viewMode === 'integrated'
                ? 'bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-pink-50 border-pink-200 text-pink-900'
                }`}>
                {viewMode === 'integrated' ? (
                    <>
                        <ShieldCheck className="w-4 h-4 text-sky-600" />
                        AVAIL merged <strong>{siloedCount || '…'}</strong> siloed department requests into <strong>{integratedCount}</strong> unified corridor block window(s) on the shared track network.
                    </>
                ) : (
                    <>
                        <AlertTriangle className="w-4 h-4 text-pink-600" />
                        3 departments schedule independently — overlapping windows stack on the same line. Hover to see conflicting requests.
                    </>
                )}
            </div>

            {/* Main Realistic Gantt Grid */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm overflow-x-auto relative">
                <div className="min-w-[1050px] space-y-2">
                    {/* Time Header Grid (00 - 23 Hours) */}
                    <div className="flex border-b border-slate-200 pb-3 mb-2 font-mono text-[11px] text-slate-500">
                        <div className="w-52 shrink-0 font-bold uppercase tracking-wider text-slate-700">Track Segment & Line</div>
                        <div className="flex-1 text-center" style={hourGrid}>
                            {hours.map((h) => (
                                <div key={h} className="border-l border-slate-200 pl-1 text-left text-slate-600 font-semibold overflow-visible">
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
                                <div key={trk.id} className="flex items-start gap-0 py-1.5 hover:bg-slate-50 rounded-xl px-2 transition-all">
                                    {/* Track Label */}
                                    <div className="w-52 shrink-0 space-y-0.5 pr-2 pt-1.5">
                                        <div className="flex items-center gap-2 font-mono font-extrabold text-xs text-slate-900">
                                            <span>{trk.segment}</span>
                                            {downCount ? <ArrowDown className="w-3.5 h-3.5 text-sky-600" /> : <ArrowUp className="w-3.5 h-3.5 text-blue-600" />}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate">
                                            {trk.line.label} {trk.segment.split('-')[0]} {downCount ? '→' : '←'} {trk.segment.split('-')[1]} · {trk.length_km} km · {trk.max_speed} km/h
                                        </div>
                                    </div>

                                    {/* 24-Hour Timeline Grid Container */}
                                    <div className="flex-1 h-10 bg-slate-50 rounded-xl relative border border-slate-200 overflow-hidden">
                                        {/* Hour Vertical Grid Lines */}
                                        <div className="absolute inset-0 grid pointer-events-none" style={hourGrid}>
                                            {hours.map((h) => <div key={h} className="border-l border-slate-200"></div>)}
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
                                                    className={`absolute rounded-md border ${viewMode === 'siloed' ? 'border-dashed border-2' : 'border-2'} ${style.border} ${style.bg} ${style.text} flex items-center justify-between px-1.5 text-[10px] font-mono font-extrabold transition-all hover:scale-[1.02] cursor-pointer z-10 shadow-sm`}
                                                    title={b.work_descriptions?.[0]}
                                                >
                                                    <span className="truncate">{b.block_id}</span>
                                                    <span className="opacity-90 hidden sm:inline">{b.start_time_str}</span>
                                                </div>
                                            );
                                        })}

                                        {segBlocks.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-slate-400 select-none pointer-events-none">
                                                NO {viewMode === 'siloed' ? 'DEPARTMENT' : 'MAINTENANCE'} WINDOW
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hover Tooltip */}
                {hoveredBlock && (
                    <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border border-slate-300 shadow-xl bg-white max-w-sm space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="font-extrabold text-sky-700">{hoveredBlock.block_id}</span>
                            <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                {hoveredBlock.segment} · {hoveredBlock.track_affected}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-sans font-medium">{hoveredBlock.work_descriptions?.[0] || 'Integrated Maintenance'}</p>
                        <div className="space-y-1 text-slate-600 text-[11px]">
                            <div>🕐 Window: <strong className="text-slate-900">{hoveredBlock.start_time_str} – {hoveredBlock.end_time_str}</strong></div>
                            {hoveredBlock.isRaw ? (
                                <div className="bg-pink-50 border border-pink-200 text-pink-800 px-2 py-1 rounded text-[10px] font-semibold">
                                    Raw siloed request — NOT yet integrated
                                </div>
                            ) : (
                                <>
                                    <div>⚡ Hours Saved: <strong className="text-emerald-700">+{hoveredBlock.hours_saved || 0}h</strong></div>
                                    <div>⚠ Delay Risk: <strong className="text-amber-700">{(hoveredBlock.predicted_delay_risk || 0).toFixed(2)}</strong></div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend / footer hint */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-slate-600 font-mono font-medium">
                <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-sky-600" /> 14 track rows = 7 real segments × DOWN/UP lines</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-sky-600" /> 24-h rolling timeline · solid = integrated, dashed = siloed</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-sky-600" /> Hover any bar for window & delay risk details</span>
            </div>
            {loadingRequests && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" /> Loading siloed baseline requests…
                </div>
            )}
        </div>
    );
}