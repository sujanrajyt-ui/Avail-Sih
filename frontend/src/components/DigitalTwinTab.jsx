import React, { useState, useEffect } from 'react';
import { Network, Activity, ShieldCheck, MapPin, Gauge, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DigitalTwinTab() {
    const [networkData, setNetworkData] = useState(null);
    const [selectedStation, setSelectedStation] = useState('CNB');

    useEffect(() => {
        fetch('/api/network')
            .then((res) => res.json())
            .then((data) => setNetworkData(data))
            .catch((err) => console.warn('[AVAIL React] Network fetch error:', err));
    }, []);

    const stations = [
        { code: 'NDLS', name: 'New Delhi', km: 0, platforms: 16, status: 'NOMINAL', congestion: 'High' },
        { code: 'CNB', name: 'Kanpur Central', km: 440, platforms: 10, status: 'NOMINAL', congestion: 'High' },
        { code: 'PRYJ', name: 'Prayagraj Jn', km: 635, platforms: 10, status: 'TSR_ACTIVE', congestion: 'Medium' },
        { code: 'DDU', name: 'Pt. DD Upadhyaya', km: 788, platforms: 8, status: 'NOMINAL', congestion: 'High' },
        { code: 'GAYA', name: 'Gaya Junction', km: 992, platforms: 9, status: 'NOMINAL', congestion: 'Low' },
        { code: 'DHN', name: 'Dhanbad Junction', km: 1178, platforms: 7, status: 'MAINT_BLOCK', congestion: 'Medium' },
        { code: 'ASN', name: 'Asansol Junction', km: 1238, platforms: 7, status: 'NOMINAL', congestion: 'Medium' },
        { code: 'HWH', name: 'Howrah Junction', km: 1447, platforms: 23, status: 'NOMINAL', congestion: 'Critical' }
    ];

    const segments = [
        { from: 'NDLS', to: 'CNB', dist: 440, tracks: 2, maxSpeed: 130, tsr: 0, status: 'CLEAR' },
        { from: 'CNB', to: 'PRYJ', dist: 195, tracks: 2, maxSpeed: 130, tsr: 60, status: 'TSR_60KMPH' },
        { from: 'PRYJ', to: 'DDU', dist: 153, tracks: 2, maxSpeed: 130, tsr: 0, status: 'CLEAR' },
        { from: 'DDU', to: 'GAYA', dist: 204, tracks: 2, maxSpeed: 110, tsr: 0, status: 'CLEAR' },
        { from: 'GAYA', to: 'DHN', dist: 186, tracks: 2, maxSpeed: 110, tsr: 45, status: 'TSR_45KMPH' },
        { from: 'DHN', to: 'ASN', dist: 60, tracks: 2, maxSpeed: 110, tsr: 0, status: 'CLEAR' },
        { from: 'ASN', to: 'HWH', dist: 209, tracks: 2, maxSpeed: 130, tsr: 0, status: 'CLEAR' }
    ];

    const activeStn = stations.find((s) => s.code === selectedStation) || stations[1];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-extrabold text-white">Box 3: Network Digital Twin (Spatio-Temporal Graph)</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        Real-time digital model of the 1,447 km New Delhi – Howrah Main Line corridor tracking node capacities, edge speeds, and signal block occupancy.
                    </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                        Nodes: <strong className="text-cyan-400">8 Junctions</strong>
                    </div>
                    <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                        Edges: <strong className="text-cyan-400">7 Track Segments</strong>
                    </div>
                </div>
            </div>

            {/* Visual Spatio-Temporal Node-Edge Graph Canvas */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 bg-slate-900/90 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Corridor Node-Edge Topology Graph</h3>
                    <span className="text-xs text-cyan-400 font-mono">1,447 km Double/Triple Electric Line</span>
                </div>

                {/* Node-Edge Flow diagram */}
                <div className="min-w-[900px] flex items-center justify-between relative py-8 px-4">
                    {/* Edge Connection Lines */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-full z-0 opacity-40"></div>

                    {stations.map((stn) => {
                        const isSelected = selectedStation === stn.code;
                        return (
                            <button
                                key={stn.code}
                                onClick={() => setSelectedStation(stn.code)}
                                className={`relative z-10 flex flex-col items-center gap-2 group transition-all ${isSelected ? 'scale-110' : 'hover:scale-105'
                                    }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xs font-mono border-2 transition-all shadow-xl ${isSelected
                                            ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-500/50 ring-4 ring-cyan-500/20'
                                            : stn.status === 'TSR_ACTIVE'
                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                                : stn.status === 'MAINT_BLOCK'
                                                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/50'
                                                    : 'bg-slate-900 text-slate-300 border-slate-700 group-hover:border-cyan-400'
                                        }`}
                                >
                                    {stn.code}
                                </div>

                                <div className="text-center">
                                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{stn.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{stn.km} km</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Station Node & Track Edge Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Selected Station Inspector */}
                <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-sm font-bold text-white">Station Node: {activeStn.name} ({activeStn.code})</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                            {activeStn.km} KM
                        </span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Platform Lines:</span>
                            <strong className="text-white font-mono">{activeStn.platforms} Tracks</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Node Status:</span>
                            <strong className="text-emerald-400 font-mono">{activeStn.status}</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Congestion Level:</span>
                            <strong className="text-amber-400 font-mono">{activeStn.congestion}</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-slate-400">Signal Block System:</span>
                            <strong className="text-cyan-400 font-mono">Absolute / Automatic Block</strong>
                        </div>
                    </div>
                </div>

                {/* Track Segments Edge Inspector */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-sm font-bold text-white">Track Segment Edges & Speed Restrictions</h3>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">7 Sub-Corridor Sections</span>
                    </div>

                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {segments.map((seg, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-cyan-400">{seg.from} ➔ {seg.to}</span>
                                    <span className="text-slate-400">({seg.dist} km)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-300">Max: <strong className="text-white">{seg.maxSpeed} km/h</strong></span>
                                    {seg.tsr > 0 ? (
                                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                                            TSR {seg.tsr} km/h
                                        </span>
                                    ) : (
                                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                                            Clear Speed
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
