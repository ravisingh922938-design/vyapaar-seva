"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Smartphone, User, Mail, ShieldCheck, ArrowRight, Loader2, Store } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', shopName: '', otp: '' });
    const router = useRouter();

    const API_BASE = "http://10.243.86.238:5000/api";

    // 1. Send OTP Logic
    const handleSendOTP = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            // यहाँ आप अपने बैकएंड की 'auth/send-otp' API कॉल करेंगे
            await axios.post(`${API_BASE}/auth/send-otp`, { phone: formData.phone });
            setStep(2);
        } catch (err) {
            alert("Error sending OTP. Mobile number check karein.");
        }
        setLoading(false);
    };

    // 2. Verify & Login Logic
    const handleAuth = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await axios.post(`${API_BASE}${endpoint}`, { ...formData });

            // टोकन सेव करें (Local Storage में)
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert(isLogin ? "Login Successful!" : "Registration Successful!");
            router.push('/'); // होम पेज पर भेजें
        } catch (err) {
            alert("Galti! Sahi OTP dalo.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-500">

                {/* Header Section */}
                <div className="bg-blue-600 p-10 text-center text-white relative">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">VYAPAAR SEVA</h1>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">
                        {isLogin ? "Welcome Back to Patna's #1 Marketplace" : "Start your business journey today"}
                    </p>
                </div>

                <div className="p-10">
                    {/* Toggle Switch */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                        <button onClick={() => { setIsLogin(true); setStep(1); }} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Login</button>
                        <button onClick={() => { setIsLogin(false); setStep(1); }} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Sign Up</button>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div className="relative">
                                        <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        <User size={18} className="absolute right-4 top-4 text-slate-300" />
                                    </div>
                                    <div className="relative">
                                        <input required placeholder="Shop Name (Business Name)" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} />
                                        <Store size={18} className="absolute right-4 top-4 text-slate-300" />
                                    </div>
                                </>
                            )}
                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="10 Digit Mobile Number" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <Smartphone size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <>Get Verification Code <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAuth} className="space-y-6 text-center">
                            <ShieldCheck size={48} className="text-blue-600 mx-auto" />
                            <div>
                                <h4 className="text-xl font-bold text-slate-800 tracking-tight">Enter 4-Digit OTP</h4>
                                <p className="text-xs text-slate-500 mt-1">Sent to +91-{formData.phone}</p>
                            </div>
                            <input required type="text" maxLength={4} placeholder="0 0 0 0" className="w-44 text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl border-2 border-blue-500 outline-none tracking-widest text-blue-600"
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })} />

                            <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg">
                                {loading ? "Verifying..." : isLogin ? "Verify & Login" : "Verify & Create Account"}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-[10px] font-black uppercase underline">Change Number</button>
                        </form>
                    )}
                </div>

                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Vister AI Security</p>
                </div>
            </div>
        </div>
    );
}