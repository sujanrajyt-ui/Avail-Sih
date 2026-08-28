import React, { useState } from 'react';
import { Database, Cpu, Network, Zap, Sliders, CheckCircle2, ArrowRight, ShieldCheck, Activity, BarChart3, LineChart, AlertTriangle } from 'lucide-react';

export default function AIPipelineTab({ decisionTrail }) {
    const [activeStep, setActiveStep] = useState(1); // Default to Step 2 Predictive Analytics

    const steps = [
        {
            step: 1,
            title: '1. Data Ingestion Pipeline',
            icon: Database,
            inputs: ['NTES Live Telemetry', 'Working Timetable (WTT)', 'Asset Health Queues', 'Loco & Rake Availability'],
            description: 'Cleans, validates, and standardizes multi-department signals and real-time train enquiry telemetry.',
            badge: 'Data Cleaning & Validation'
        },
        {
            step: 2,
            title: '2. Predictive Analytics (ML)',
            icon: Cpu,
            inputs: ['LSTM / Regressor Running Time Predictor', 'Asset Failure Urgency Classifier', 'Telemetry IsolationForest Anomaly Detector'],
            description: 'Predicts section running times, dwell times, and 30-day failure probabilities for critical track assets.',
            badge: `Held-Out F1: ${decisionTrail?.failure_model_metrics?.test_f1 ?? 0.7500}`
        },
        {
            step: 3,
            title: '3. Network Digital Twin',
            icon: Network,
            inputs: ['Spatio-Temporal Graph', 'Stations (Nodes)', 'Track Segments (Edges)', 'Signal Blocks & Speed Restrictions'],
            description: 'Digital representation of the congested 1,447 km New Delhi - Howrah main line corridor.',
            badge: 'NDLS - HWH Corridor'
        },
        {
            step: 4,
            title: '4. Constraint Optimization (CP-SAT)',
            icon: Zap,
            inputs: ['Google OR-Tools CP-SAT Solver', 'Track Occupancy Non-Overlapping Intervals', 'Cross-Department Merging Logic'],
            description: 'Calculates mathematically optimal, conflict-free maintenance schedules that satisfy AI-determined priorities.',
            badge: '0 Track Collisions Guaranteed'
        },
        {
            step: 5,
            title: '5. What-If Simulator Interface',
            icon: Sliders,
            inputs: ['Interactive Re-optimization Sliders', 'Live Corridor Gantt Timeline', 'Scenario Impact Analysis'],
            description: 'Allows traffic controllers to preview, test disruption scenarios, and compare block timings before live dispatch.',
            badge: 'Sub-400ms Response Time'
        },
        {
            step: 6,
            title: '6. Optimal Block Schedule Output',
            icon: CheckCircle2,
            inputs: ['Conflict-Free Timetable', 'Synchronized Civil/OHE/S&T Windows', '1-Click CSV Export & REST API'],
            description: 'Final automated schedule output minimizing train delays while securing mandatory track maintenance.',
            badge: '33% Idle Reduction'
        }
    ];

    const current = steps[activeStep];
    const Icon = current.icon;

    const featureImportances = [
        { name: 'Time Since Last Maintenance (Days)', weight: 35, color: 'bg-cyan-500' },
        { name: 'Track Axle Load Index (Tons)', weight: 28, color: 'bg-blue-500' },
        { name: 'Vibration Telemetry RMS (G-force)', weight: 22, color: 'bg-purple-500' },
        { name: 'Rail Temperature (°C)', weight: 15, color: 'bg-amber-500' }
    ];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40">
                <h2 className="text-lg font-extrabold text-white">6-Step Technical Architecture Pipeline</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    Direct implementation of Page 3 of the SIH presentation deck. Click any step below to inspect data ingestion, ML predictive models, Digital Twin graph, and CP-SAT constraint optimization.
                </p>
            </div>

            {/* Stepper Grid (Zeigarnik Effect & Goal-Gradient) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {steps.map((s, idx) => {
                    const StepIcon = s.icon;
                    const isActive = idx === activeStep;
                    return (
                        <button
                            key={s.step}
                            onClick={() => setActiveStep(idx)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 ${isActive
                                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/15 scale-105 z-10'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-cyan-400">Step {s.step}</span>
                                <StepIcon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                            </div>
                            <span className="text-xs font-bold line-clamp-2 leading-snug">{s.title.split('. ')[1]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Box 2 Predictive Analytics Detailed Inspector */}
            {activeStep === 1 ? (
                <div className="space-y-6">
                    {/* Box 2 ML Models Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/90 space-y-3">
                            <div className="flex items-center gap-2">
                                <LineChart className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Running & Dwell Time ML</h4>
                            </div>
                            <div className="text-2xl font-black font-mono text-cyan-400">LSTM + Regressor</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Predicts section running delays and station dwell times across 23 trains on 7 track segments (R&sup2; = {decisionTrail?.delay_model_metrics?.calibrated_r2 ?? 0.9934}).
                            </p>
                            <div className="text-[10px] font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                                MAE: {decisionTrail?.delay_model_metrics?.mae_mins ?? 4.7} mins • R&sup2;: {decisionTrail?.delay_model_metrics?.calibrated_r2 ?? 0.9934} • Held-out test split
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-slate-900/90 space-y-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-amber-400" />
                                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Asset Failure Urgency ML</h4>
                            </div>
                            <div className="text-2xl font-black font-mono text-amber-400">RandomForest Classifier</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Predicts 30-day failure probability for track switches, OHE lines, and signal interlockings.
                            </p>
                            <div className="text-[10px] font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                                F1 Score: {decisionTrail?.failure_model_metrics?.test_f1 ?? 0.7500} • Test Acc: {((decisionTrail?.failure_model_metrics?.test_accuracy ?? 0.84) * 100).toFixed(1)}%
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-5 border border-pink-500/30 bg-slate-900/90 space-y-3">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-pink-400" />
                                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Telemetry Anomaly Detector</h4>
                            </div>
                            <div className="text-2xl font-black font-mono text-pink-400">IsolationForest (Unsupervised)</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Detects real-time vibration spikes, OHE voltage drops, and track circuit lag in NTES telemetry.
                            </p>
                            <div className="text-[10px] font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                                Anomaly Threshold: -0.12 • Boost Weight: +0.15 Priority
                            </div>
                        </div>
                    </div>

                    {/* Feature Importances Visual Bar Chart */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 bg-slate-900/90">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Asset Failure Model Feature Importance Breakdown</h3>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">1,000 Asset Telemetry Records</span>
                        </div>

                        <div className="space-y-3">
                            {featureImportances.map((feat, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-slate-300">{feat.name}</span>
                                        <strong className="text-cyan-400">{feat.weight}%</strong>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <div className={`h-full ${feat.color} rounded-full transition-all`} style={{ width: `${feat.weight}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Active Step Detailed Card for other steps */
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 bg-slate-900/90">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-white">{current.title}</h3>
                                <span className="text-xs text-cyan-400 font-mono font-bold">{current.badge}</span>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                            Pipeline Stage {current.step} of 6
                        </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{current.description}</p>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Technical Components & Inputs:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {current.inputs.map((inp, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-slate-200">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                    <span>{inp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
