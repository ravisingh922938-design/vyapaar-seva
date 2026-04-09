"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X, ShieldCheck, Smartphone, CheckCircle, Loader2,
    MapPin, RefreshCw, ArrowLeft, MessageSquareText, Home, User
} from 'lucide-react';

export default function InquiryModal({ selectedCat, isOpen, onClose }: any) {
    const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: 'Boring Road',
        fullAddress: '',
        purpose: '',
        otp: ''
    });

    // ✅ SAHI API BASE PATH (Leads ke liye hamesha leads use karein)
    const API_BASE = "http://localhost:5000/api/leads";

    // Modal khulne par sab reset karein
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({ name: '', phone: '', area: 'Boring Road', fullAddress: '', purpose: '', otp: '' });
            setTimer(30);
            setLoading(false);
        }
    }, [isOpen]);

    // OTP Timer logic
    useEffect(() => {
        let interval: any;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    if (!isOpen) return null;

    // --- STEP 1: OTP BHEJNA ---
    const handleSendOTP = async (e?: any) => {
        if (e) e.preventDefault();

        if (!formData.name || formData.phone.length !== 10 || !formData.purpose || !formData.fullAddress) {
            alert("Kripya saari jankari sahi se bhariye.");
            return;
        }

        setLoading(true);
        try {
            // ✅ Sahi Endpoint: /api/leads/send-otp
            await axios.post(`${API_BASE}/send-otp`, { phone: formData.phone });
            setStep(2);
            setTimer(30);
        } catch (err: any) {
            alert("OTP bhejne mein galti! Check karein backend terminal chalu hai?");
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY & CREATE LEAD ---
    const handleVerify = async (e: any) => {
        e.preventDefault();
        if (formData.otp.length < 4) return alert("Sahi OTP dalo.");

        setLoading(true);
        try {
            // ✅ Sahi Endpoint: /api/leads/verify-lead
            await axios.post(`${API_BASE}/verify-lead`, {
                customerName: formData.name,
                customerPhone: formData.phone,
                category: selectedCat._id,
                area: formData.area,
                description: formData.purpose,
                fullAddress: formData.fullAddress,
                otp: formData.otp
            });
            setStep(3);
        } catch (err: any) {
            alert(err.response?.data?.message || "Galti! OTP sahi se check karke dalo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 border-[1px] border-slate-200">

                {/* --- HEADER --- */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-5 text-white/70 hover:text-white">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">VYAPAAR SEVA</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Verified Patna Experts</p>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">

                    {/* --- STEP 1: ENQUIRY FORM --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="text-center mb-4">
                                <h4 className="text-xl font-bold text-slate-800">Quotes for <span className="text-blue-600 underline">{selectedCat?.name}</span></h4>
                            </div>

                            <div className="relative">
                                <input required placeholder="Your Name" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                <User size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                                <Smartphone size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required placeholder="What do you need? (e.g. AC Gas)" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} value={formData.purpose} />
                                <MessageSquareText size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <select className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl font-bold text-slate-600 appearance-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })} value={formData.area}>
                                    <option value="Boring Road">Boring Road</option>
                                    <option value="Kankarbagh">Kankarbagh</option>
                                    <option value="Patliputra">Patliputra</option>
                                    <option value="Raja Bazar">Raja Bazar</option>
                                </select>
                                <MapPin size={16} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <textarea required rows={2} placeholder="Address & Landmark" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} value={formData.fullAddress} />
                                <Home size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-700 transition-all flex justify-center items-center">
                                {loading ? <Loader2 className="animate-spin" /> : "Verify Number"}
                            </button>
                        </form>
                    )}

                    {/* --- STEP 2: OTP VERIFY --- */}
                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-6 text-center">
                            <ShieldCheck size={56} className="text-blue-600 mx-auto" />
                            <div>
                                <h4 className="text-2xl font-bold text-slate-800 tracking-tight">Enter OTP</h4>
                                <p className="text-xs text-slate-500">Sent to +91-{formData.phone}</p>
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-[10px] font-bold mt-2 underline uppercase">Edit Info</button>
                            </div>

                            <input required type="text" maxLength={4} placeholder="• • • •"
                                className="w-48 text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl border-2 border-blue-500 outline-none tracking-widest text-blue-600"
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })} autoFocus />

                            <div className="space-y-3">
                                <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase shadow-xl active:scale-95 transition-all">
                                    {loading ? "Confirming..." : "Confirm & Send"}
                                </button>

                                {timer > 0 ? (
                                    <p className="text-[10px] text-slate-400 font-bold">Resend OTP in {timer}s</p>
                                ) : (
                                    <button type="button" onClick={handleSendOTP} className="text-blue-600 text-[10px] font-black uppercase flex items-center justify-center gap-1 mx-auto">
                                        <RefreshCw size={12} /> Resend Now
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* --- STEP 3: SUCCESS --- */}
                    {step === 3 && (
                        <div className="text-center py-6">
                            <CheckCircle size={80} className="text-green-600 mx-auto mb-6 animate-bounce" />
                            <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Enquiry Live!</h4>
                            <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">
                                Dhanyawad! Patna ke verified experts aapko 5-10 minute mein call karenge.
                            </p>
                            <button onClick={onClose} className="mt-10 bg-slate-900 text-white px-12 py-3 rounded-full font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
                                DONE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}