import React, { useState } from 'react';
import { Download, Send, CheckCircle2, FileText } from 'lucide-react';

export default function ReportsTab({ blocks, onRequestSubmitted }) {
    const [formData, setFormData] = useState({
        department: 'Civil',
        from_station: 'NDLS',
        to_station: 'CNB',
        start_hour: 14,
        end_hour: 18,
        work_type: 'Track Tamping & Rail Maintenance',
        priority: 2
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null);

    const handleDownloadCSV = () => {
        let csv = 'Block_ID,Segment,Departments,Start,End,Duration_h,Hours_Saved,Risk_Score\n';
        blocks.forEach((b) => {
            csv += [
                b.block_id,
                b.segment,
                (b.departments || []).join('+'),
                b.start_time_str,
                b.end_time_str,
                b.integrated_hours,
                b.hours_saved,
                (b.predicted_delay_risk || 0).toFixed(2)
            ].join(',') + '\n';
        });

        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        link.download = `avail_integrated_schedule_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMsg(null);

        const payload = {
            request_id: `REQ-UI-${Date.now()}`,
            department: formData.department,
            department_code: formData.department === 'Civil' ? 'CIV' : (formData.department.startsWith('OHE') ? 'OHE' : 'ST'),
            segment: `${formData.from_station}-${formData.to_station}`,
            from_station: formData.from_station,
            to_station: formData.to_station,
            work_type: formData.work_type,
            preferred_start_min: formData.start_hour * 60,
            preferred_end_min: formData.end_hour * 60,
            min_duration_min: (formData.end_hour - formData.start_hour) * 60,
            priority: parseInt(formData.priority),
            track_affected: 'DOWN_LINE',
            required_speed_restriction_kmph: 30
        };

        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setStatusMsg({ type: 'success', text: `Request submitted! Active Requests: ${data.total_requests}` });
                onRequestSubmitted();
            } else {
                setStatusMsg({ type: 'error', text: 'Error submitting request.' });
            }
        } catch (err) {
            setStatusMsg({ type: 'error', text: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-lg font-bold text-white">Block Requests & Schedule Export</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Submit new departmental maintenance requests and export optimized schedule CSVs.</p>
                </div>

                <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 shrink-0"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Schedule CSV</span>
                </button>
            </div>

            {/* Main Request Form */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 max-w-2xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submit New Maintenance Window Request</h3>

                {statusMsg && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                        }`}>
                        {statusMsg.text}
                    </div>
                )}

                <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="Civil">Civil Engineering</option>
                                <option value="OHE (Electrical)">OHE (Electrical)</option>
                                <option value="S&T (Signalling)">S&T (Signalling)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">Priority Level</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value={1}>1 - Emergency / High Priority</option>
                                <option value={2}>2 - Routine Integrated Block</option>
                                <option value={3}>3 - Flexible Deferred Window</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">From Station</label>
                            <input
                                type="text"
                                value={formData.from_station}
                                onChange={(e) => setFormData({ ...formData, from_station: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:border-cyan-500 focus:outline-none font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">To Station</label>
                            <input
                                type="text"
                                value={formData.to_station}
                                onChange={(e) => setFormData({ ...formData, to_station: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:border-cyan-500 focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Work Description</label>
                        <input
                            type="text"
                            value={formData.work_type}
                            onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:border-cyan-500 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? 'Submitting Request...' : 'Submit Request to AI Merger'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
