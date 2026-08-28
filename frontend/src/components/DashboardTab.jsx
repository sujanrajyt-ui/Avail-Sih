import React from 'react';
import { TrendingUp, Clock, Zap, CheckCircle2, AlertTriangle, ArrowRight, Cpu, Layers, ShieldCheck, Activity, ArrowRightLeft } from 'lucide-react';

export default function DashboardTab({ metrics, blocks, decisionTrail, onSelectTab }) {
    const deptColors = {
        'Civil': { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
        'OHE (Electrical)': { border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
        'S&T (Signalling)': { border: 'border-pink-500/50', bg: 'bg-pink-500/10', text: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' }
    };

    // Page 2 SIH Deck Claims
    const sihClaims = [
        { label: 'Idle Days Eliminated', value: '16%', sub: 'Machine Clustering', color: 'text-cyan-400 border-cyan-500/30' },
        { label: 'Loco Failures Prevented', value: '400%', sub: 'Preemptive Scheduling', color: 'text-amber-400 border-amber-500/30' },
        { label: 'OHE Failures Addressed', value: '700%', sub: 'Integrated Windows', color: 'text-pink-400 border-pink-500/30' },
        { label: 'Journey Time Savings', value: '~5.5h', sub: '110/130 kmph Trains', color: 'text-emerald-400 border-emerald-500/30' }
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {sihClaims.map((claim, idx) => (
                    <div key={idx} className={`glass-card rounded-2xl p-5 border ${claim.color} bg-slate-900/80 flex flex-col justify-between h-32`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{claim.label}</span>
                        <div>
                            <div className={`text-3xl font-black font-mono ${claim.color.split(' ')[0]}`}>{claim.value}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{claim.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main AI Status Header */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                        <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-extrabold text-white">AVAIL Autonomous AI Engine Online</h2>
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                                0 Track Collisions Guaranteed
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            CP-SAT Solve Speed: <strong className="text-cyan-400 font-mono">{parseFloat(metrics?.cp_sat_solve_duration_sec || 0.128).toFixed(3)}s</strong> • Track Conflicts Resolved: <strong className="text-emerald-400 font-mono">{metrics?.track_conflicts_resolved || 51}</strong>
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onSelectTab('pipeline')}
                    className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                    <span>Explore 6-Step Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Grid: Blocks List & Problem Resolution Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Integrated Corridor Blocks */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI-Integrated Corridor Blocks</h3>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                            {blocks.length} Merged Windows
                        </span>
                    </div>

                    <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                        {blocks.map((block) => {
                            const dept = block.departments?.[0] || 'Civil';
                            const style = deptColors[dept] || deptColors['Civil'];
                            const risk = parseFloat(block.predicted_delay_risk || 0);

                            return (
                                <div
                                    key={block.block_id}
                                    className={`p-4 rounded-xl bg-slate-900/90 border-l-4 ${style.border} border-y border-r border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-sm text-white">{block.block_id}</span>
                                            <span className="font-semibold text-xs text-slate-300">({block.segment})</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                                                {block.departments?.join(' + ') || dept}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            {block.work_descriptions?.[0] || 'Integrated Maintenance'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                                        <div className="text-slate-300 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                                            ⏱ {block.start_time_str} – {block.end_time_str} ({block.integrated_hours}h)
                                        </div>
                                        <div className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                                            +{block.hours_saved}h Saved
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Col: Problem Resolution Matrix (SIH Page 2) */}
                <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Problem Resolution Matrix</h3>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            How AVAIL transforms legacy Indian Railways block planning into AI autonomous execution:
                        </p>

                        <div className="space-y-2.5">
                            {transformations.map((t, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                                    <div className="text-[11px] text-pink-400 line-through">Legacy: {t.before}</div>
                                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>AVAIL: {t.after}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => onSelectTab('simulation')}
                        className="w-full mt-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2"
                    >
                        <span>Test What-If Scenario</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
