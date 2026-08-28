import React, { useState } from 'react';
import { MapPin, Navigation, Gauge, ShieldCheck, AlertTriangle, Train, ArrowRight } from 'lucide-react';

export default function CorridorMap() {
    const [activeSegment, setActiveSegment] = useState('NDLS-CNB');

    const segments = [
        { id: 'NDLS-CNB', name: 'New Delhi ➔ Kanpur Central', length: '440 km', trains: 8, maxSpeed: 130, tsr: 0, status: 'NOMINAL', color: 'emerald' },
        { id: 'CNB-PRYJ', name: 'Kanpur Central ➔ Prayagraj', length: '195 km', trains: 5, maxSpeed: 130, tsr: 60, status: 'TSR_60KMPH', color: 'amber' },
        { id: 'PRYJ-DDU', name: 'Prayagraj ➔ Pt. DD Upadhyaya', length: '153 km', trains: 4, maxSpeed: 130, tsr: 0, status: 'NOMINAL', color: 'emerald' },
        { id: 'DDU-GAYA', name: 'Pt. DD Upadhyaya ➔ Gaya', length: '204 km', trains: 3, maxSpeed: 110, tsr: 0, status: 'NOMINAL', color: 'emerald' },
        { id: 'GAYA-DHN', name: 'Gaya ➔ Dhanbad Junction', length: '186 km', trains: 2, maxSpeed: 110, tsr: 45, status: 'TSR_45KMPH', color: 'amber' },
        { id: 'DHN-ASN', name: 'Dhanbad ➔ Asansol Junction', length: '60 km', trains: 3, maxSpeed: 110, tsr: 0, status: 'NOMINAL', color: 'emerald' },
        { id: 'ASN-HWH', name: 'Asansol ➔ Howrah Junction', length: '209 km', trains: 6, maxSpeed: 130, tsr: 0, status: 'NOMINAL', color: 'emerald' }
    ];

    const current = segments.find((s) => s.id === activeSegment) || segments[0];

    return (
        <div className="space-y-6">
            {/* Map Header */}
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-extrabold text-white">Box 5: Geographic Corridor Route Map & Live Telemetry</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        Interactive GIS-style visual route tracking train densities, speed restrictions, and live maintenance block segments along the 1,447 km NDLS-HWH trunk line.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                    <Train className="w-4 h-4 text-cyan-400" />
                    <span>Active Trains: <strong className="text-cyan-400">23 En Route</strong></span>
                </div>
            </div>

            {/* Visual Geographic Map Segment Line */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/90 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">NDLS ➔ HWH Trunk Route GIS Segments</h3>
                    <span className="text-xs font-mono text-slate-400">Click segment to inspect telemetry</span>
                </div>

                {/* Map Route Segment Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    {segments.map((seg) => {
                        const isSelected = seg.id === activeSegment;
                        return (
                            <button
                                key={seg.id}
                                onClick={() => setActiveSegment(seg.id)}
                                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${isSelected
                                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-105 z-10'
                                        : seg.tsr > 0
                                            ? 'bg-amber-500/10 border-amber-500/40 text-slate-300 hover:border-amber-400'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[11px] font-bold text-cyan-400">{seg.id}</span>
                                    {seg.tsr > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                                </div>
                                <div className="text-[11px] font-bold line-clamp-1">{seg.name.split(' ➔ ')[1]}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{seg.length}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Map Segment Telemetry Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segment Section</h4>
                    </div>
                    <div className="text-base font-extrabold text-white">{current.name}</div>
                    <div className="text-xs font-mono text-slate-400">Total Track Distance: <strong className="text-cyan-400">{current.length}</strong></div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Permissible Speed & TSR</h4>
                    </div>
                    <div className="text-base font-extrabold font-mono text-white">
                        Max Speed: <span className="text-cyan-400">{current.maxSpeed} km/h</span>
                    </div>
                    {current.tsr > 0 ? (
                        <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                            Active TSR: {current.tsr} km/h (Track Maintenance)
                        </span>
                    ) : (
                        <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded">
                            No Speed Restrictions
                        </span>
                    )}
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                        <Train className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Train Traffic Density</h4>
                    </div>
                    <div className="text-base font-extrabold font-mono text-white">{current.trains} Express/Freight Trains</div>
                    <div className="text-xs text-slate-400 font-mono">Segment Occupancy Rate: <strong className="text-emerald-400">Normal Capacity</strong></div>
                </div>
            </div>
        </div>
    );
}
