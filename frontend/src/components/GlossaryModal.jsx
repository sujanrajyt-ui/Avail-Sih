import React, { useState } from 'react';
import { BookOpen, Search, X, Tag, Sparkles, ShieldCheck } from 'lucide-react';

export default function GlossaryModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    if (!isOpen) return null;

    const terms = [
        {
            term: 'AVAIL',
            category: 'System',
            fullForm: 'Autonomous Block Planning Engine',
            meaning: 'The AI platform that automatically merges siloed departmental requests into conflict-free maintenance windows, maximizing asset availability for Indian Railways.'
        },
        {
            term: 'CP-SAT',
            category: 'AI / ML',
            fullForm: 'Constraint Programming - Satisfiability Solver',
            meaning: 'Google OR-Tools solver that formulates timetable scheduling as a mathematical constraint satisfaction problem to mathematically guarantee 0 track collisions.'
        },
        {
            term: 'OHE',
            category: 'Department',
            fullForm: 'Overhead Equipment (Electrical)',
            meaning: 'Department responsible for high-voltage (25kV AC) traction wires, catenaries, isolators, and power supply lines along electrified railway tracks.'
        },
        {
            term: 'S&T',
            category: 'Department',
            fullForm: 'Signalling & Telecommunication',
            meaning: 'Department managing electronic interlocking systems, track circuits, point machines, signals, axle counters, and GSM-R railway communication.'
        },
        {
            term: 'Civil (P-Way)',
            category: 'Department',
            fullForm: 'Permanent Way (Civil Engineering)',
            meaning: 'Department managing physical rails, sleepers, ballast beds, turnouts, switches, bridges, and track alignment.'
        },
        {
            term: 'Shadow Block / Merged Window',
            category: 'Operations',
            fullForm: 'Integrated Multi-Department Maintenance Window',
            meaning: 'A single, unified track closure time slot where Civil, OHE, and S&T work simultaneously on the same segment, preventing redundant train stoppages.'
        },
        {
            term: 'UP Line',
            category: 'Operations',
            fullForm: 'Upward Direction Track',
            meaning: 'Track segment where train traffic travels towards New Delhi (Westbound).'
        },
        {
            term: 'DOWN Line',
            category: 'Operations',
            fullForm: 'Downward Direction Track',
            meaning: 'Track segment where train traffic travels towards Howrah/Kolkata (Eastbound).'
        },
        {
            term: 'Digital Twin',
            category: 'System',
            fullForm: 'Virtual Network Graph Topology',
            meaning: 'Graph-based virtual model representing 1,447 km NDLS-HWH corridor with real-time station nodes, track edges, speed restrictions, and live train density.'
        },
        {
            term: 'Isolation Forest',
            category: 'AI / ML',
            fullForm: 'Unsupervised Anomaly Detection Algorithm',
            meaning: 'Machine learning model detecting abnormal sensor telemetry spikes (e.g., track temperature >58°C, rail expansion, or voltage drops).'
        },
        {
            term: 'Random Forest Classifier',
            category: 'AI / ML',
            fullForm: 'Supervised Asset Failure Risk Classifier',
            meaning: 'ML model with F1 score = 0.75 predicting asset failure probability based on age, tonnage, ambient temperature, and maintenance history.'
        },
        {
            term: 'TSR / PSR',
            category: 'Operations',
            fullForm: 'Temporary Speed Restriction / Permanent Speed Restriction',
            meaning: 'Enforced speed limits (e.g. 30 km/h or 45 km/h) imposed on trains during active track maintenance or structural works.'
        },
        {
            term: 'Tamping',
            category: 'Operations',
            fullForm: 'Ballast Tamping Work',
            meaning: 'Mechanical compaction of crushed stone ballast under railway sleepers to restore geometric track alignment and smooth train rides.'
        },
        {
            term: 'CAG Audit Report No. 22',
            category: 'Compliance',
            fullForm: 'Comptroller and Auditor General of India Audit (2021)',
            meaning: 'Official Indian Government audit benchmark citing 12,466 timetable conflicts, 400% surge in loco failures, and 700% OHE failure spikes caused by siloed planning.'
        },
        {
            term: 'NDLS-HWH Corridor',
            category: 'Network',
            fullForm: 'New Delhi to Howrah Main Railway Line',
            meaning: '1,447 km critical Golden Quadrilateral railway trunk route connecting New Delhi, Kanpur, Prayagraj, DDU, Gaya, Dhanbad, Asansol, and Howrah.'
        },
        {
            term: 'SIH26027',
            category: 'Compliance',
            fullForm: 'Smart India Hackathon Problem Statement 26027',
            meaning: 'Problem Statement ID: AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways.'
        }
    ];

    const categories = ['ALL', 'System', 'AI / ML', 'Department', 'Operations', 'Network', 'Compliance'];

    const filteredTerms = terms.filter((item) => {
        const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.fullForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <div className="glass-card w-full max-w-3xl rounded-2xl border border-slate-200 p-5 sm:p-6 bg-white shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center font-bold">
                            <BookOpen className="w-5 h-5 text-sky-700" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                <span>📖 Indian Railways & AVAIL Glossary</span>
                                <span className="text-[10px] font-mono bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
                                    {terms.length} KEYWORDS
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500">Comprehensive meanings of all technical terms, algorithms, and railway acronyms used on the platform.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="space-y-3 shrink-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Search term, acronym, or meaning..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-sky-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Terms Scrollable List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {filteredTerms.length > 0 ? (
                        filteredTerms.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all space-y-1.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-extrabold text-slate-900">{item.term}</h3>
                                        <span className="text-[10px] font-mono text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full font-bold">
                                            {item.fullForm}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded font-semibold">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.meaning}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400 font-mono">
                            No terms matching "{searchTerm}" found in glossary.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 font-mono flex items-center justify-between shrink-0">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> SIH26027 Official Terminology Standard</span>
                    <button
                        onClick={onClose}
                        className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-sans font-bold text-xs hover:bg-slate-800"
                    >
                        Close Glossary
                    </button>
                </div>
            </div>
        </div>
    );
}
