import React from 'react';
import { TrendingUp, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight, Cpu, Layers, ShieldCheck, Activity, ArrowRightLeft } from 'lucide-react';

export default function DashboardTab({ metrics, blocks, decisionTrail, onSelectTab, onOpenMaintenance }) {
    const deptColors = {
        'Civil': { border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800 border border-amber-200' },
        'OHE (Electrical)': { border: 'border-sky-400', bg: 'bg-sky-50', text: 'text-sky-800', badge: 'bg-sky-100 text-sky-800 border border-sky-200' },
        'S&T (Signalling)': { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-800', badge: 'bg-purple-100 text-purple-800 border border-purple-200' }
    };

    // Page 2 SIH Deck Claims
    const sihClaims = [
        { label: 'Idle Machine Time Saved', value: '33.3%', sub: '31.25 Corridor Hours Recovered', color: 'text-sky-700 border-sky-200 bg-white' },
        { label: 'Track Collisions Guaranteed', value: '0 Conflicts', sub: 'CP-SAT Solver Hard Constraints', color: 'text-emerald-700 border-emerald-200 bg-white' },
        { label: 'OHE & Loco Failures Prevented', value: '400%', sub: 'CAG Audit Benchmark Addressed', color: 'text-purple-700 border-purple-200 bg-white' },
        { label: 'Corridor Capacity Restored', value: '11.5 Hours', sub: 'NDLS-HWH 1,447 km Digital Twin', color: 'text-indigo-700 border-indigo-200 bg-white' }
    ];

    const transformations = [
        { before: 'Siloed Departments', after: 'Unified Cross-Department Scheduling' },
        { before: 'Manual Planning', after: 'Algorithmic CP-SAT Optimization' },
        { before: 'Track Conflicts', after: 'Automated Conflict Resolution (0 Collisions)' },
        { before: 'Idle Machines', after: 'Smart Job Clustering' },
        { before: 'Delay Ripple Effects', after: 'Real-Time Replanning' }
    ];

    return (
        <div className="space-y-6">
            {/* SIH Pitch Deck Key Claims Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sihClaims.map((claim, idx) => (
                    <div key={idx} className={`glass-card rounded-2xl p-5 border ${claim.color} shadow-sm flex flex-col justify-between min-h-[120px]`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{claim.label}</span>
                        <div className="mt-2">
                            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${claim.color.split(' ')[0]}`}>{claim.value}</div>
                            <div className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">{claim.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main AI Status Header */}
            <div className="glass-card rounded-2xl p-6 border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 border border-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-200 shrink-0">
                        <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-extrabold text-slate-900">AVAIL Autonomous AI Engine Online</h2>
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                                0 Track Collisions Guaranteed
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                            CP-SAT Solve Speed: <strong className="text-sky-700 font-mono">{parseFloat(metrics?.cp_sat_solve_duration_sec || 0).toFixed(2)}s</strong> • Track Conflicts Resolved: <strong className="text-emerald-700 font-mono">{metrics?.track_conflicts_resolved || 0}</strong>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpenMaintenance}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-sky-700 border border-sky-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                        <span>➕ Request AI Maintenance</span>
                    </button>

                    <button
                        onClick={() => onSelectTab('pipeline')}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                        <span>Explore 6-Step Pipeline</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>


            {/* Grid: Blocks List & Problem Resolution Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Integrated Corridor Blocks */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4 bg-white shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-sky-600" />
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI-Integrated Corridor Blocks</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            {blocks.length} Merged Windows
                        </span>
                    </div>

                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {blocks.map((block) => {
                            const dept = block.departments?.[0] || 'Civil';
                            const style = deptColors[dept] || deptColors['Civil'];

                            return (
                                <div
                                    key={block.block_id}
                                    className={`p-4 rounded-xl bg-slate-50 border-l-4 ${style.border} border-y border-r border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-sm text-slate-900">{block.block_id}</span>
                                            <span className="font-semibold text-xs text-slate-600">({block.segment})</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                                                {block.departments?.join(' + ') || dept}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600">
                                            {block.work_descriptions?.[0] || 'Integrated Maintenance'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                                        <div className="text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                                            ⏱ {block.start_time_str} – {block.end_time_str} ({block.integrated_hours}h)
                                        </div>
                                        <div className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                                            +{block.hours_saved}h Saved
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Col: Problem Resolution Matrix (SIH Page 2) */}
                <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between bg-white shadow-sm border border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
                            <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Problem Resolution Matrix</h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            How AVAIL transforms legacy Indian Railways block planning into AI autonomous execution:
                        </p>

                        <div className="space-y-2.5">
                            {transformations.map((t, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                                        <span className="font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">BEFORE</span>
                                        <span>{t.before}</span>
                                    </div>
                                    <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span>AVAIL: {t.after}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onSelectTab('simulation')}
                        className="w-full mt-4 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                    >
                        <span>Test What-If Scenario</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

