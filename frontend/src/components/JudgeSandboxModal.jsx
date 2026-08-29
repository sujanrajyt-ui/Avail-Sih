import React, { useState } from 'react';
import { Gamepad2, Zap, AlertTriangle, CheckCircle2, ArrowRight, Bot, Cpu, Sparkles, RefreshCw, X } from 'lucide-react';

export default function JudgeSandboxModal({ isOpen, onClose, onSimulateComplete }) {
    const [scenarioType, setScenarioType] = useState('ANOMALY_SPIKE');
    const [trainDelayMins, setTrainDelayMins] = useState(35);
    const [maintenanceDurationHours, setMaintenanceDurationHours] = useState(2.5);
    const [segment, setSegment] = useState('CNB-PRYJ');
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const scenarios = [
        { id: 'ANOMALY_SPIKE', label: '1. Track Temp Spike (58°C Rail Expansion)', desc: 'Simulate high rail temperature trigger on double electric line.' },
        { id: 'VANDE_BHARAT_DELAY', label: '2. Vande Bharat Express Delay (+35 mins)', desc: 'Inject emergency priority override for Train 22436.' },
        { id: 'OHE_LINE_BREAKDOWN', label: '3. Preemptive OHE Line Sag Warning', desc: 'Simulate sensor voltage drop warning requiring urgent maintenance.' }
    ];

    const handleRunSandbox = async () => {
        setIsSimulating(true);
        setResult(null);

        // Run a REAL isolation-forest + failure-risk + CP-SAT solve on the backend
        try {
            const res = await fetch('/api/sandbox-simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario_type: scenarioType,
                    segment: segment,
                    train_delay_mins: parseInt(trainDelayMins || 0),
                    block_window_hours: parseFloat(maintenanceDurationHours || 2.5)
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Sandbox solve failed');
            setResult(data);
            if (onSimulateComplete) onSimulateComplete();
        } catch (err) {
            console.warn('[AVAIL React] Sandbox solve error:', err);
            setResult({
                solve_time_ms: 0,
                collisions_baseline: 0,
                collisions_avail: 0,
                delay_baseline_mins: 0,
                delay_avail_mins: 0,
                hours_saved: 0,
                reasoning_steps: [`Sandbox solve failed: ${err.message}`]
            });
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-2xl rounded-2xl border border-purple-500/40 p-6 bg-slate-900 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
                            <Gamepad2 className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                                <span>🎮 Interactive Judge Testing Sandbox</span>
                                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                                    LIVE AI SIMULATOR
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">Inject custom disruptions and watch AVAIL's AI engine re-solve schedules in real-time!</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Controls for Judges */}
                <div className="space-y-4 text-xs">
                    <div>
                        <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1">Select Disruption Scenario</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {scenarios.map((sc) => (
                                <button
                                    key={sc.id}
                                    onClick={() => setScenarioType(sc.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${scenarioType === sc.id
                                        ? 'bg-purple-500/20 border-purple-400 text-white font-bold shadow-lg shadow-purple-500/15'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="font-bold text-purple-300 mb-1">{sc.label.split('. ')[1]}</div>
                                    <div className="text-[10px] text-slate-400 leading-tight">{sc.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className="font-bold text-slate-400 block mb-1">Target Track Segment</label>
                            <select
                                value={segment}
                                onChange={(e) => setSegment(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-400 focus:outline-none"
                            >
                                <option value="NDLS-CNB">NDLS-CNB (New Delhi-Kanpur)</option>
                                <option value="CNB-PRYJ">CNB-PRYJ (Kanpur-Prayagraj)</option>
                                <option value="PRYJ-DDU">PRYJ-DDU (Prayagraj-DDU)</option>
                                <option value="DDU-GAYA">DDU-GAYA (DDU-Gaya)</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-bold text-slate-400 block mb-1">Train Delay Injection (Mins)</label>
                            <input
                                type="number"
                                value={trainDelayMins}
                                onChange={(e) => setTrainDelayMins(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="font-bold text-slate-400 block mb-1">Block Window (Hours)</label>
                            <input
                                type="number"
                                step="0.5"
                                value={maintenanceDurationHours}
                                onChange={(e) => setMaintenanceDurationHours(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-purple-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleRunSandbox}
                        disabled={isSimulating}
                        className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSimulating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>CP-SAT Constraint Engine Solving...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                <span>⚡ Run Live AI Constraint Solver</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Live Simulation Results & AI Reasoning Matrix */}
                {result && (
                    <div className="space-y-4 border-t border-slate-800 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span>Live AI Resolution Matrix</span>
                            </h3>
                            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
                                Solve Time: {result.solve_time_ms} ms
                            </span>
                        </div>

                        {/* Before vs After Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Baseline Collisions</span>
                                <strong className="text-amber-400 text-base">{result.collisions_baseline} Conflicts</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                                <span className="text-[10px] text-emerald-400 block">AVAIL Track Collisions</span>
                                <strong className="text-emerald-300 text-base">{result.collisions_avail} Collisions</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] text-slate-400 block">Unmanaged Delay</span>
                                <strong className="text-pink-400 text-base">{result.delay_baseline_mins} mins</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                                <span className="text-[10px] text-cyan-400 block">AVAIL Managed Delay</span>
                                <strong className="text-cyan-300 text-base">{result.delay_avail_mins} mins</strong>
                            </div>
                        </div>

                        {/* Step-by-Step AI Reasoning Explainer */}
                        <div className="glass-card p-4 rounded-xl border border-purple-500/30 bg-slate-950 space-y-2">
                            <h4 className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Bot className="w-3.5 h-3.5 text-purple-400" />
                                <span>AI Decision Reasoning Trail:</span>
                            </h4>
                            <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                                {result.reasoning_steps.map((stepStr, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-purple-400 font-bold">➔</span>
                                        <span>{stepStr}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
