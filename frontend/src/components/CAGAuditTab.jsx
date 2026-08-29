import React from 'react';
import { BookOpen, ExternalLink, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function CAGAuditTab() {
    const references = [
        {
            stat: '2.2% integrated blocks vs 97.8% isolated blocks',
            source: 'CAG Compliance Report No. 22 of 2021 (RTI Kolkata case study)',
            link: 'https://cag.gov.in/uploads/research/paper/RES-220900-Peer-Reviewed-Case-Study-on-Punctuality-20230807-052050-1068f089ca70b4b7-79400532.pdf',
            label: 'CAG Official Research Paper'
        },
        {
            stat: '4,10,059 asset failure cases (2018-19)',
            source: 'CAG Report No. 22 of 2021 (Indian Railways Punctuality Audit)',
            link: 'https://cag.gov.in/uploads/research/paper/RES-220900-Peer-Reviewed-Case-Study-on-Punctuality-20230807-052050-1068f089ca70b4b7-79400532.pdf',
            label: 'CAG Punctuality Audit'
        },
        {
            stat: 'Engineering asset-failure delay share jumped 4.89% → 14.81%',
            source: 'CAG Report No. 22 of 2021 Audit Data',
            link: 'https://cag.gov.in/uploads/research/paper/RES-220900-Peer-Reviewed-Case-Study-on-Punctuality-20230807-052050-1068f089ca70b4b7-79400532.pdf',
            label: 'CAG Delay Share Analysis'
        },
        {
            stat: '32% / 30% track machine idle reasons (blocks not planned/given)',
            source: 'CAG Performance Audit on Derailments (Deccan Herald Audit)',
            link: 'https://www.deccanherald.com/amp/story/india%2Flack-of-timely-maintenance-of-tracks-major-reason-for-train-derailments-cag-1175012.html',
            label: 'Deccan Herald Report'
        },
        {
            stat: '400% loco failure surge & 7x OHE failure jump',
            source: 'ISignal Infrastructure Punctuality Study',
            link: 'https://www.isignal.in/infrastructure/indian-railways-is-under-strain-whats-burdening-them-971092',
            label: 'ISignal Research'
        },
        {
            stat: 'AI & OR approaches for joint train-scheduling & maintenance',
            source: 'MDPI Sensors Survey & ScienceDirect Operations Research Paper',
            link: 'https://doi.org/10.3390/s26030906',
            label: 'MDPI Sensors Journal'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-amber-200 bg-white shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-slate-900">CAG Research, Audits & References</h2>
                </div>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                    AVAIL is directly validated against official Comptroller and Auditor General (CAG) of India compliance reports and peer-reviewed operations research literature.
                </p>
            </div>

            {/* 12,466 Conflicts Hotspot Evidence */}
            <div className="glass-card rounded-2xl p-6 border border-sky-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-sky-600" />
                    <div>
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Validated Hotspot: New Delhi – Howrah Corridor</h3>
                        <span className="text-xs text-sky-700 font-mono font-semibold">CAG 2021 Audit Baseline</span>
                    </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    The CAG's 2021 audit identified <strong className="text-sky-700 font-extrabold">12,466 timetable conflicts</strong> on the New Delhi – Howrah route via RailSys simulation. AVAIL directly targets this route to eliminate conflicts using CP-SAT constraint optimization.
                </p>
            </div>

            {/* References Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {references.map((ref, idx) => (
                    <div key={idx} className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                {ref.label}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 pt-1">{ref.stat}</h4>
                            <p className="text-xs text-slate-600 font-medium">{ref.source}</p>
                        </div>

                        <a
                            href={ref.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors pt-2"
                        >
                            <span>View Verified Document</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

