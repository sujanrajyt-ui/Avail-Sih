import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, CheckCircle2, Bot, KeyRound, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [step, setStep] = useState(1); // 1: Credentials, 2: USSD/OTP
    const [username, setUsername] = useState('controller_ndls');
    const [password, setPassword] = useState('••••••••••••');
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    if (!isOpen) return null;

    const handleSendOtp = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            onLoginSuccess();
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md rounded-2xl border border-slate-200 p-6 bg-white shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-900">AVAIL Enterprise Access Control</h2>
                        <p className="text-xs text-sky-700 font-mono font-semibold">SIH26027 • USSD / OTP Dual-Factor Auth</p>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                Railway Controller Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                Security Passcode
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-sky-600 shrink-0" />
                            <span>OTP will be transmitted via Indian Railways USSD Gateway (*139#)</span>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-sky-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-sm hover:bg-sky-700 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Transmit USSD / OTP Challenge</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
                            <span>USSD OTP sent to registered terminal (+91 98765-XXXXX)</span>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                Enter 6-Digit OTP Code (Simulated: 481920)
                            </label>
                            <input
                                type="text"
                                placeholder="481920"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-base font-mono font-bold tracking-widest text-sky-700 focus:border-sky-500 focus:bg-white focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifying}
                            className="w-full bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isVerifying ? (
                                <span>Authenticating Credentials...</span>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Authorize & Enter AVAIL Command Center</span>
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

