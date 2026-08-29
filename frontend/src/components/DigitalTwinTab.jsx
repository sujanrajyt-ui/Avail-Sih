import React, { useState, useEffect } from 'react';
import { Network, Activity, ShieldCheck, MapPin, Gauge, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

const DEFAULT_STATIONS = [
    { code: 'NDLS', name: 'New Delhi', km: 0, platforms: 16, status: 'NOMINAL', congestion: 'High' },
    { code: 'CNB', name: 'Kanpur Central', km: 440, platforms: 10, status: 'NOMINAL', congestion: 'High' },
    { code: 'PRYJ', name: 'Prayagraj', km: 635, platforms: 10, status: 'NOMINAL', congestion: 'Medium' },
    { code: 'DDU', name: 'Pt. DD Upadhyaya', km: 788, platforms: 8, status: 'NOMINAL', congestion: 'High' },
    { code: 'GAYA', name: 'Gaya Junction', km: 992, platforms: 9, status: 'NOMINAL', congestion: 'Low' },
    { code: 'DHN', name: 'Dhanbad Junction', km: 1193, platforms: 7, status: 'NOMINAL', congestion: 'Medium' },
    { code: 'ASN', name: 'Asansol Junction', km: 1252, platforms: 7, status: 'NOMINAL', congestion: 'Medium' },
    { code: 'HWH', name: 'Howrah Junction', km: 1447, platforms: 23, status: 'NOMINAL', congestion: 'Critical' }
];

const DEFAULT_SEGMENTS = [
    { from: 'NDLS', to: 'CNB', dist: 440, tracks: 2, maxSpeed: 130 },
    { from: 'CNB', to: 'PRYJ', dist: 195, tracks: 2, maxSpeed: 130 },
    { from: 'PRYJ', to: 'DDU', dist: 153, tracks: 2, maxSpeed: 130 },
    { from: 'DDU', to: 'GAYA', dist: 204, tracks: 2, maxSpeed: 110 },
    { from: 'GAYA', to: 'DHN', dist: 201, tracks: 2, maxSpeed: 110 },
    { from: 'DHN', to: 'ASN', dist: 59, tracks: 2, maxSpeed: 120 },
    { from: 'ASN', to: 'HWH', dist: 194, tracks: 2, maxSpeed: 130 }
];

export default function DigitalTwinTab() {
    const [networkData, setNetworkData] = useState(null);
    const [selectedStation, setSelectedStation] = useState('CNB');

    useEffect(() => {
        fetch('/api/network')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.stations && data.stations.length > 0) {
                    setNetworkData(data);
                }
            })
            .catch((err) => console.warn('[AVAIL React] Network fetch error:', err));
    }, []);

    const stationMeta = {
        NDLS: { platforms: 16, status: 'NOMINAL', congestion: 'High' },
        CNB: { platforms: 10, status: 'NOMINAL', congestion: 'High' },
        PRYJ: { platforms: 10, status: 'NOMINAL', congestion: 'Medium' },
        DDU: { platforms: 8, status: 'NOMINAL', congestion: 'High' },
        GAYA: { platforms: 9, status: 'NOMINAL', congestion: 'Low' },
        DHN: { platforms: 7, status: 'NOMINAL', congestion: 'Medium' },
        ASN: { platforms: 7, status: 'NOMINAL', congestion: 'Medium' },
        HWH: { platforms: 23, status: 'NOMINAL', congestion: 'Critical' }
    };

    const stations = (networkData?.stations?.length ? networkData.stations : DEFAULT_STATIONS).map((st) => {
        const meta = stationMeta[st.code] || { platforms: 8, status: 'NOMINAL', congestion: 'Medium' };
        return {
            code: st.code || 'CNB',
            name: st.name || st.code || 'Station',
            km: st.km ?? 0,
            platforms: meta.platforms,
            status: meta.status,
            congestion: meta.congestion
        };
    });

    const segments = networkData?.segments?.length
        ? networkData.segments.map((seg) => ({
            from: seg.from,
            to: seg.to,
            dist: seg.length_km,
            tracks: seg.tracks,
            maxSpeed: seg.max_speed_kmph
        }))
        : DEFAULT_SEGMENTS;

    const activeStn = stations.find((s) => s.code === selectedStation) || stations[0] || DEFAULT_STATIONS[0];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-sky-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-sky-600" />
                        <h2 className="text-lg font-bold text-slate-900">Box 3: Network Digital Twin (Spatio-Temporal Graph)</h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                        Real-time digital model of the 1,447 km New Delhi – Howrah Main Line corridor tracking node capacities, edge speeds, and signal block occupancy.
                    </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                        Nodes: <strong className="text-sky-700">8 Junctions</strong>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                        Edges: <strong className="text-sky-700">7 Track Segments</strong>
                    </div>
                </div>
            </div>

            {/* Visual Spatio-Temporal Node-Edge Graph Canvas */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-6 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Corridor Node-Edge Topology Graph</h3>
                    <span className="text-xs text-sky-700 font-mono font-semibold">1,447 km Double/Triple Electric Line</span>
                </div>

                {/* Node-Edge Flow diagram */}
                <div className="min-w-[900px] flex items-center justify-between relative py-8 px-4">
                    {/* Edge Connection Line */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 rounded-full z-0 opacity-70"></div>

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
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xs font-mono border-2 transition-all shadow-md ${isSelected
                                        ? 'bg-sky-600 text-white border-sky-400 ring-4 ring-sky-100 shadow-sky-200'
                                        : 'bg-white text-slate-800 border-slate-300 group-hover:border-sky-500'
                                        }`}
                                >
                                    {stn.code}
                                </div>

                                <div className="text-center">
                                    <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors">{stn.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{stn.km} km</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Station Node & Track Edge Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Selected Station Inspector */}
                <div className="glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-sky-600" />
                            <h3 className="text-sm font-bold text-slate-900">Station Node: {activeStn?.name || 'Kanpur Central'} ({activeStn?.code || 'CNB'})</h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                            {activeStn?.km ?? 440} KM
                        </span>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Platform Lines:</span>
                            <strong className="text-slate-900 font-mono">{activeStn?.platforms ?? 10} Tracks</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Node Status:</span>
                            <strong className="text-emerald-700 font-mono">{activeStn?.status || 'NOMINAL'}</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Congestion Level:</span>
                            <strong className="text-amber-700 font-mono">{activeStn?.congestion || 'High'}</strong>
                        </div>
                        <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                            <span className="text-slate-600 font-medium">Signal Block System:</span>
                            <strong className="text-sky-700 font-mono">Absolute / Automatic Block</strong>
                        </div>
                    </div>
                </div>

                {/* Track Segments Edge Inspector */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-sky-600" />
                            <h3 className="text-sm font-bold text-slate-900">Track Segment Edges & Speed Restrictions</h3>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">7 Sub-Corridor Sections</span>
                    </div>

                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {segments.map((seg, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-sky-700">{seg.from} ➔ {seg.to}</span>
                                    <span className="text-slate-500">({seg.dist} km)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-600">Max: <strong className="text-slate-900">{seg.maxSpeed} km/h</strong></span>
                                    <span className="text-slate-500">{seg.tracks} tracks</span>
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                                        Clear Speed
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

