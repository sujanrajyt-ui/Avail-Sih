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
import JudgeSandboxModal from './components/JudgeSandboxModal';
import MaintenanceModal from './components/MaintenanceModal';
import GlossaryModal from './components/GlossaryModal';
import { ArrowRight, Play } from 'lucide-react';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [metrics, setMetrics] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [decisionTrail, setDecisionTrail] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);

    // Theme State (default: 'light')
    const [theme, setTheme] = useState('light');

    // Auth, Demo Mode, Sandbox, Maintenance & Glossary Modal State
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSandboxOpen, setIsSandboxOpen] = useState(false);
    const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
    const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [demoStep, setDemoStep] = useState(0);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    };

    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }, [theme]);

    const demoTourSteps = [
        { tab: 'dashboard', title: 'Step 1: Executive Operations Dashboard', desc: 'Highlights 33.3% idle machine time reduction, 0 track collisions, and Indian Railways resolution matrix.' },
        { tab: 'pipeline', title: 'Step 2: 6-Step Technical AI Pipeline', desc: 'Examines ML Delay Risk, Random Forest failure classifier (F1=0.75), and CP-SAT Constraint Solver.' },
        { tab: 'twin', title: 'Step 3: Network Digital Twin Graph', desc: 'Visualizes the 1,447 km NDLS-HWH node-edge topology graph with speed restrictions.' },
        { tab: 'gantt', title: 'Step 4: 24-Hour Corridor Gantt Canvas', desc: 'Displays UP & DOWN track segment schedules with Civil, OHE, and S&T maintenance windows.' },
        { tab: 'map', title: 'Step 5: GIS Route Map & Live Telemetry', desc: 'Tracks live train densities and permissible speeds along the corridor.' },
        { tab: 'simulation', title: 'Step 6: What-If Scenario Simulator', desc: 'Allows traffic controllers to test disruption scenarios and re-optimize schedules in <0.35s.' },
        { tab: 'audit', title: 'Step 7: CAG Audit Compliance Proof', desc: 'Cites CAG Compliance Report No. 22 of 2021 and 12,466 timetable conflict audit baseline.' }
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
        <div className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative transition-colors ${theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'bg-[#0B0F19] text-slate-100'}`}>
            {/* Official Indian Railways Government Header Bar */}
            <div className="bg-slate-950 text-slate-200 border-b border-slate-800 text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
                <div className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                    <span className="font-extrabold tracking-wide text-white">भारतीय रेल | INDIAN RAILWAYS</span>
                    <span className="hidden sm:inline text-slate-400">• Ministry of Railways, Govt. of India</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded font-bold">
                        NDLS-HWH 1,447 km Corridor Operational
                    </span>
                    <span className="hidden md:inline text-amber-400 font-bold">
                        SIH26027 Priority AI System
                    </span>
                </div>
            </div>
            {/* Tricolor Accent Line */}
            <div className="h-0.5 bg-gradient-to-r from-orange-500 via-white to-emerald-500 w-full z-50"></div>

            {/* Top Navbar */}
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOptimizing={isOptimizing}
                onReoptimize={handleReoptimize}
                onOpenAuth={() => setIsAuthOpen(true)}
                onStartDemo={startDemoTour}
                onOpenSandbox={() => setIsSandboxOpen(true)}
                onOpenMaintenance={() => setIsMaintenanceOpen(true)}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
                theme={theme}
                onToggleTheme={toggleTheme}
            />

            {/* Main View Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Premium High-Visibility Guided Presentation Tour Controller */}
                {isDemoMode && (
                    <div className="bg-slate-900 text-white rounded-2xl border-2 border-sky-400 p-5 shadow-2xl space-y-3 relative overflow-hidden transition-all">
                        {/* Top Accent Glow Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-extrabold font-mono text-base shadow-lg shrink-0">
                                    {demoStep + 1}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                            🤖 AVAIL Guided Tour Step {demoStep + 1} of {demoTourSteps.length}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                                        {demoTourSteps[demoStep].title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
                                        {demoTourSteps[demoStep].desc}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {demoStep > 0 && (
                                    <button
                                        onClick={() => {
                                            const prevIdx = demoStep - 1;
                                            setDemoStep(prevIdx);
                                            setActiveTab(demoTourSteps[prevIdx].tab);
                                        }}
                                        className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        <span>Back</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => setIsDemoMode(false)}
                                    className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-all"
                                >
                                    Exit
                                </button>

                                <button
                                    onClick={nextDemoStep}
                                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/30 transition-all active:scale-95"
                                >
                                    <span>{demoStep === demoTourSteps.length - 1 ? 'Finish Tour 🎉' : 'Next Step'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Interactive Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 h-full transition-all duration-500"
                                style={{ width: `${((demoStep + 1) / demoTourSteps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        metrics={metrics}
                        blocks={blocks}
                        decisionTrail={decisionTrail}
                        onSelectTab={setActiveTab}
                        onOpenMaintenance={() => setIsMaintenanceOpen(true)}
                    />
                )}

                {(activeTab === 'pipeline' || activeTab === 'twin') && (
                    <div className="space-y-6">
                        <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800 w-fit">
                            <button
                                onClick={() => setActiveTab('pipeline')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'pipeline' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                Box 2: ML Models
                            </button>
                            <button
                                onClick={() => setActiveTab('twin')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'twin' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                Box 3: Digital Twin Graph
                            </button>
                        </div>
                        {activeTab === 'pipeline' ? <AIPipelineTab decisionTrail={decisionTrail} /> : <DigitalTwinTab />}
                    </div>
                )}

                {(activeTab === 'gantt' || activeTab === 'map') && (
                    <div className="space-y-6">
                        <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800 w-fit">
                            <button
                                onClick={() => setActiveTab('gantt')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'gantt' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                Box 5: Realistic Corridor Gantt
                            </button>
                            <button
                                onClick={() => setActiveTab('map')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'map' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                Box 5: GIS Route Map
                            </button>
                        </div>
                        {activeTab === 'gantt' ? <GanttTab blocks={blocks} /> : <CorridorMap />}
                    </div>
                )}

                {activeTab === 'simulation' && (
                    <SimulationTab
                        onSimulate={handleSimulate}
                        isSimulating={isSimulating}
                        simulationResult={simulationResult}
                    />
                )}

                {(activeTab === 'audit' || activeTab === 'reports') && (
                    <div className="space-y-6">
                        <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800 w-fit">
                            <button
                                onClick={() => setActiveTab('audit')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'audit' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                CAG Audit Proof
                            </button>
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'reports' ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                            >
                                CSV Ingestion & Reports
                            </button>
                        </div>
                        {activeTab === 'audit' ? <CAGAuditTab /> : <ReportsTab blocks={blocks} onRequestSubmitted={fetchAllData} />}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                    <span className="font-bold text-slate-300">AVAIL Autonomous AI Platform</span> — SIH 2026 (SIH26027)
                </div>
                <div className="font-mono text-[11px] text-cyan-500">
                    Team Durga Ghee Podi Dosa • NDLS-HWH 1,447 km Digital Twin
                </div>
            </footer>

            {/* Modals */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLoginSuccess={() => setIsAuthenticated(true)}
            />

            <JudgeSandboxModal
                isOpen={isSandboxOpen}
                onClose={() => setIsSandboxOpen(false)}
            />

            <MaintenanceModal
                isOpen={isMaintenanceOpen}
                onClose={() => setIsMaintenanceOpen(false)}
                onRequestSubmitted={fetchAllData}
            />

            <GlossaryModal
                isOpen={isGlossaryOpen}
                onClose={() => setIsGlossaryOpen(false)}
            />
        </div>
    );
}


