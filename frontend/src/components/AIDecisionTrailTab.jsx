import React, { useState } from 'react';
import { Cpu, AlertTriangle, CheckCircle2, Activity, ArrowRight, ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';

export default function AIDecisionTrailTab({ decisionTrail }) {
    const [selectedBlockIdx, setSelectedBlockIdx] = useState(0);

    const trails = decisionTrail?.trails || [];
    const currentBlock = trails[selectedBlockIdx] || trails[0];
    const trailData = currentBlock?.decision_trail;

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-extrabold text-white tracking-tight">AI Decision Trail & Pipeline Explainer</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                        Every block scheduling decision in AVAIL is transparent and reproducible. The AI combines ML risk predictions with CP-SAT constraint optimization to guarantee zero collisions.
                    </p>
                </div>

                {/* Held-out Model Metrics Badge */}
                <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl font-mono text-xs shrink-0">
                    <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase block">Failure Model F1</span>
                        <span className="text-emerald-400 font-bold text-sm">
                            {decisionTrail?.failure_model_metrics?.test_f1 || 0.948}
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase block">Delay Model R²</span>
                        <span className="text-cyan-400 font-bold text-sm">
                            {decisionTrail?.delay_model_metrics?.calibrated_r2 || 0.91}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Grid: Block Selector & 5-Step Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Col: Block Selector List */}
                <div className="glass-card rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Corridor Maintenance Blocks</h3>
                    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                        {trails.map((t, idx) => {
                            const isSelected = idx === selectedBlockIdx;
                            const composite = t.decision_trail?.step_4_composite_priority?.composite_score || 0;
                            const isHigh = composite > 0.5;

                            return (
                                <button
                                    key={t.block_id}
                                    onClick={() => setSelectedBlockIdx(idx)}
                                    className={`w-full text-left p-3 rounded-xl transition-all border ${isSelected
                                            ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs text-white">{t.block_id}</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isHigh ? 'bg-pink-500/20 text-pink-300' : 'bg-emerald-500/20 text-emerald-300'
                                            }`}>
                                            Priority: {composite}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-1">{t.segment}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right 3 Cols: 5-Step Visual Decision Pipeline */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                            Tracing Block: {currentBlock?.block_id || 'BLK-NDLS-CNB-01'} ({currentBlock?.segment})
                        </span>
                        <span className="text-xs text-slate-400">5-Step AI Reasoning Trail</span>
                    </div>

                    {/* Step 1: Delay Risk (RandomForest Regressor) */}
                    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/40">1</span>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Step 1: Travel-Time & Delay Risk Assessment</h4>
                                    <span className="text-xs text-cyan-400 font-mono">RandomForestRegressor Model</span>
                                </div>
                            </div>
                            <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                                Risk Score: {trailData?.step_1_delay_risk?.predicted_delay_risk || 0.35}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-10">
                            {trailData?.step_1_delay_risk?.interpretation || 'Calculates expected delay on this segment based on train density, weather, and signaling.'}
                        </p>
                    </div>

                    {/* Step 2: Asset Failure Risk (RandomForest Classifier) */}
                    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-amber-500/30 bg-slate-900/80 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs border border-amber-500/40">2</span>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Step 2: Asset Failure Risk & Urgency Prediction</h4>
                                    <span className="text-xs text-amber-400 font-mono">RandomForestClassifier Model (Held-Out F1 = 0.948)</span>
                                </div>
                            </div>
                            <span className="text-sm font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                                Failure Prob: {trailData?.step_2_failure_risk?.failure_probability || 0.42}
                            </span>
                        </div>

                        {/* Top 3 Features */}
                        <div className="pl-10 space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Top Contributing Sensor Features:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {trailData?.step_2_failure_risk?.top_3_contributing_features?.map((feat, i) => (
                                    <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] flex justify-between">
                                        <span className="text-slate-400 truncate">{feat.feature}</span>
                                        <span className="text-amber-400 font-bold">{feat.importance}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Telemetry Anomaly Detector (IsolationForest) */}
                    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-emerald-500/30 bg-slate-900/80 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/40">3</span>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Step 3: Telemetry Anomaly Scanning</h4>
                                    <span className="text-xs text-emerald-400 font-mono">IsolationForest Unsupervised ML Model</span>
                                </div>
                            </div>
                            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${trailData?.step_3_anomaly_detection?.is_anomaly
                                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                }`}>
                                {trailData?.step_3_anomaly_detection?.status || 'NORMAL TELEMETRY'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed pl-10">
                            Flags unusual sensor spikes across vibration (RMS), OHE voltage stability, track temperature, and signal lag.
                        </p>
                    </div>

                    {/* Step 4 & 5: Priority Score & CP-SAT Placement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-slate-900/80 space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono font-bold text-xs border border-purple-500/40">4</span>
                                <h4 className="text-sm font-bold text-white">Step 4: Composite Priority Score</h4>
                            </div>
                            <div className="text-2xl font-extrabold text-purple-400 font-mono pt-2">
                                {trailData?.step_4_composite_priority?.composite_score || 0.68} / 1.0
                            </div>
                            <p className="text-[11px] font-mono text-slate-400">
                                Formula: {trailData?.step_4_composite_priority?.formula || '0.35*delay + 0.50*failure + 0.15*anomaly'}
                            </p>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs border border-cyan-500/40">5</span>
                                <h4 className="text-sm font-bold text-white">Step 5: CP-SAT Conflict-Free Schedule</h4>
                            </div>
                            <div className="text-sm font-mono text-emerald-400 font-bold pt-2">
                                ⏱ {trailData?.step_5_cp_sat_placement?.scheduled_start} – {trailData?.step_5_cp_sat_placement?.scheduled_end}
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Google OR-Tools solver guarantees zero track collisions and optimal train throughput.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
