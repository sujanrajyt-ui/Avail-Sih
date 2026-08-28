import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import AIPipelineTab from './components/AIPipelineTab';
import DigitalTwinTab from './components/DigitalTwinTab';
import GanttTab from './components/GanttTab';
import CorridorMap from './components/CorridorMap';
import SimulationTab from './components/SimulationTab';
import CAGAuditTab from './components/CAGAuditTab';
import ReportsTab from './components/ReportsTab';
import AuthModal from './components/AuthModal';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [metrics, setMetrics] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [decisionTrail, setDecisionTrail] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);

    // Auth & Demo Mode State
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoStep, setDemoStep] = useState(0);

    const demoTourSteps = [
        { tab: 'dashboard', title: 'Step 1: SIH Key Claims & Executive Dashboard', desc: 'Highlights 16% idle days eliminated, 400% loco failure surge addressed, and Problem Resolution Matrix.' },
        { tab: 'pipeline', title: 'Step 2: 6-Step Technical Architecture Pipeline', desc: 'Examines ML Delay Risk, Asset Failure Classifier (F1=0.948), and CP-SAT Constraint Solver.' },
        { tab: 'twin', title: 'Step 3: Network Digital Twin (Box 3)', desc: 'Visualizes the 1,447 km NDLS-HWH node-edge topology graph with speed restrictions.' },
        { tab: 'gantt', title: 'Step 4: Realistic Corridor Gantt Canvas (Box 5)', desc: 'Displays 24-hour UP/DN track segment schedules with Civil, OHE, and S&T maintenance windows.' },
        { tab: 'map', title: 'Step 5: GIS Route Map & Live Telemetry', desc: 'Tracks live train densities and permissible speeds along the corridor.' },
        { tab: 'simulation', title: 'Step 6: What-If Scenario Simulator', desc: 'Allows traffic controllers to test disruption scenarios and re-optimize schedules in <0.35s.' },
        { tab: 'audit', title: 'Step 7: CAG Audit Proof & Research Citations', desc: 'Cites CAG Compliance Report No. 22 of 2021 and 12,466 timetable conflict audit baseline.' }
    ];

    const fetchAllData = async () => {
        try {
            const [mRes, bRes, tRes] = await Promise.all([
                fetch('/api/metrics'),
                fetch('/api/merge-blocks'),
                fetch('/api/ai-decision-trail')
            ]);

            if (mRes.ok) setMetrics(await mRes.json());
            if (bRes.ok) {
                const bData = await bRes.json();
                setBlocks(bData.integrated_blocks || []);
            }
            if (tRes.ok) setDecisionTrail(await tRes.json());
        } catch (err) {
            console.warn('[AVAIL React] Data fetch error:', err);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleReoptimize = async () => {
        setIsOptimizing(true);
        try {
            await fetchAllData();
        } finally {
            setTimeout(() => setIsOptimizing(false), 500);
        }
    };

    const handleSimulate = async ({ startAdj, duration }) => {
        setIsSimulating(true);
        try {
            const modifiedBlocks = blocks.map((b) => ({
                ...b,
                start_min: b.start_min + startAdj,
                end_min: b.end_min + startAdj,
                duration_min: Math.round(duration * 60)
            }));

            const res = await fetch('/api/what-if', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modified_blocks: modifiedBlocks,
                    merge_window_minutes: 120
                })
            });

            if (res.ok) {
                setSimulationResult(await res.json());
            }
        } catch (err) {
            console.warn('[AVAIL React] Simulation error:', err);
        } finally {
            setIsSimulating(false);
        }
    };

    const startDemoTour = () => {
        setIsDemoMode(true);
        setDemoStep(0);
        setActiveTab(demoTourSteps[0].tab);
    };

    const nextDemoStep = () => {
        if (demoStep < demoTourSteps.length - 1) {
            const nextIdx = demoStep + 1;
            setDemoStep(nextIdx);
            setActiveTab(demoTourSteps[nextIdx].tab);
        } else {
            setIsDemoMode(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative">
            {/* Top Navbar */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOptimizing={isOptimizing}
                onReoptimize={handleReoptimize}
                onOpenAuth={() => setIsAuthOpen(true)}
                onStartDemo={startDemoTour}
            />

            {/* Judges Guided Presentation Tour Banner */}
            {isDemoMode && (
                <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 border-b border-purple-500/40 p-4 px-6 flex flex-wrap items-center justify-between gap-4 sticky top-[61px] z-40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center font-bold font-mono text-xs">
                            {demoStep + 1}/{demoTourSteps.length}
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-white">{demoTourSteps[demoStep].title}</h3>
                            <p className="text-xs text-purple-200">{demoTourSteps[demoStep].desc}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsDemoMode(false)}
                            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700"
                        >
                            Exit Tour
                        </button>
                        <button
                            onClick={nextDemoStep}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-indigo-500 transition-all"
                        >
                            <span>{demoStep === demoTourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main View Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        metrics={metrics}
                        blocks={blocks}
                        decisionTrail={decisionTrail}
                        onSelectTab={setActiveTab}
                    />
                )}

                {activeTab === 'pipeline' && (
                    <AIPipelineTab decisionTrail={decisionTrail} />
                )}

                {activeTab === 'twin' && (
                    <DigitalTwinTab />
                )}

                {activeTab === 'gantt' && (
                    <GanttTab blocks={blocks} />
                )}

                {activeTab === 'map' && (
                    <CorridorMap />
                )}

                {activeTab === 'simulation' && (
                    <SimulationTab
                        onSimulate={handleSimulate}
                        isSimulating={isSimulating}
                        simulationResult={simulationResult}
                    />
                )}

                {activeTab === 'audit' && (
                    <CAGAuditTab />
                )}

                {activeTab === 'reports' && (
                    <ReportsTab
                        blocks={blocks}
                        onRequestSubmitted={fetchAllData}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                    <span className="font-bold text-slate-300">AVAIL Autonomous AI Platform</span> — SIH 2026 (SIH26027)
                </div>
                <div className="font-mono text-[11px] text-cyan-400">
                    Team Durga Ghee Podi Dosa • NDLS-HWH 1,447 km Digital Twin
                </div>
            </footer>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLoginSuccess={() => setIsAuthenticated(true)}
            />
        </div>
    );
}
