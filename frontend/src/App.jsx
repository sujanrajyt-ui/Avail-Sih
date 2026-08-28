import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import AIPipelineTab from './components/AIPipelineTab';
import DigitalTwinTab from './components/DigitalTwinTab';
import GanttTab from './components/GanttTab';
import SimulationTab from './components/SimulationTab';
import CAGAuditTab from './components/CAGAuditTab';
import ReportsTab from './components/ReportsTab';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [metrics, setMetrics] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [decisionTrail, setDecisionTrail] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);

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

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOptimizing={isOptimizing}
                onReoptimize={handleReoptimize}
            />

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

            <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                    <span className="font-bold text-slate-300">AVAIL Autonomous AI Platform</span> — SIH 2026 (SIH26027)
                </div>
                <div className="font-mono text-[11px] text-cyan-400">
                    Team Durga Ghee Podi Dosa • NDLS-HWH 1,447 km Digital Twin
                </div>
            </footer>
        </div>
    );
}
