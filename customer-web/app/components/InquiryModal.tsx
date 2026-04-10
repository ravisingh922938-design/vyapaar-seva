"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    X, ShieldCheck, Smartphone, CheckCircle, Loader2,
    MapPin, RefreshCw, ArrowLeft, MessageSquareText, Home, User
} from 'lucide-react';

export default function InquiryModal({ selectedCat, isOpen, onClose }: any) {
    const [step, setStep] = useState(1);
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

    // ✅ FINAL FIXED URL: आपका बैकएंड '/api/vendors' के अंदर 'send-otp' को संभालता है
    const API_BASE_URL = "https://api.vister.in/api/vendors";

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({ name: '', phone: '', area: 'Boring Road', fullAddress: '', purpose: '', otp: '' });
            setTimer(30);
            setLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval: any;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    if (!isOpen) return null;

    // --- STEP 1: SEND OTP ---
    const handleSendOTP = async (e?: any) => {
        if (e) e.preventDefault();

        if (!formData.name.trim() || formData.phone.length !== 10 || !formData.purpose.trim() || !formData.fullAddress.trim()) {
            alert("Bhai, saari details bharna zaroori hai!");
            return;
        }

        setLoading(true);
        console.log("Requesting OTP from:", `${API_BASE_URL}/send-otp`);

        try {
            // ✅ सही POST रिक्वेस्ट
            const res = await axios.post(`${API_BASE_URL}/send-otp`,
                { phone: formData.phone },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log("Server Response:", res.data);
            setStep(2);
            setTimer(30);
        } catch (err: any) {
            console.error("FULL ERROR OBJECT:", err);

            // मंटू भाई, यहाँ ध्यान दें: ये मैसेज आपको असली बीमारी बताएगा
            const errorMessage = err.response?.data?.message || err.message;

            if (err.response?.status === 404) {
                alert("Error 404: Backend par rasta nahi mila. `/api/vendors/send-otp` check karein.");
            } else if (errorMessage.includes("balance")) {
                alert("Fast2SMS mein balance khatam ho gaya hai!");
            } else {
                alert(`OTP Error: ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY & SUBMIT ---
    const handleVerify = async (e: any) => {
        e.preventDefault();
        if (formData.otp.length < 4) return alert("4-digit OTP dalo.");

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/verify-lead`, {
                customerName: formData.name,
                customerPhone: formData.phone,
                category: selectedCat?._id,
                area: formData.area,
                description: formData.purpose,
                fullAddress: formData.fullAddress,
                otp: formData.otp
            });
            setStep(3);
        } catch (err: any) {
            alert(err.response?.data?.message || "OTP galat hai ya expire ho gaya.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 font-sans text-slate-800">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 border-[1px] border-slate-200">

                {/* HEADER */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-5 text-white/70 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">VYAPAAR SEVA</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Patna's Trusted Experts</p>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto no-scrollbar">

                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="text-center mb-6">
                                <h4 className="text-xl font-bold text-slate-800 tracking-tight">Quotes for <span className="text-blue-600 underline">{selectedCat?.name}</span></h4>
                            </div>

                            <div className="relative">
                                <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 font-bold"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                <User size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 font-bold"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                                <Smartphone size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required placeholder="What do you need?" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 font-bold"
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} value={formData.purpose} />
                                <MessageSquareText size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <select className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-slate-600 appearance-none focus:border-blue-500"
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })} value={formData.area}>
                                    <option value="Boring Road">Boring Road</option>
                                    <option value="Kankarbagh">Kankarbagh</option>
                                    <option value="Patliputra">Patliputra</option>
                                    <option value="Raja Bazar">Raja Bazar</option>
                                </select>
                                <MapPin size={16} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <textarea required rows={2} placeholder="Full Address & Landmark" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 resize-none font-bold"
                                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} value={formData.fullAddress} />
                                <Home size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-[1000] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-3">
                                {loading ? <Loader2 className="animate-spin" /> : "Verify via OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-8 text-center py-6">
                            <ShieldCheck size={64} className="text-blue-600 mx-auto" />
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Confirm Number</h4>
                                <p className="text-xs text-slate-500 mt-1">Sent to +91-{formData.phone}</p>
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-[10px] font-black mt-2 underline uppercase tracking-widest">Edit Details</button>
                            </div>

                            <input required type="text" maxLength={4} placeholder="0 0 0 0"
                                className="w-48 text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl border-2 border-blue-500 outline-none tracking-[0.5em] text-blue-600 shadow-inner"
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })} autoFocus />

                            <div className="space-y-4">
                                <button disabled={loading} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black uppercase shadow-lg shadow-green-100 active:scale-95 transition-all">
                                    {loading ? "Checking..." : "Confirm & Submit"}
                                </button>

                                {timer > 0 ? (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resend OTP in {timer}s</p>
                                ) : (
                                    <button type="button" onClick={handleSendOTP} className="text-blue-600 text-[10px] font-black uppercase flex items-center justify-center gap-1 mx-auto hover:scale-105 transition-transform">
                                        <RefreshCw size={12} /> Resend OTP Now
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10">
                            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                                <CheckCircle size={56} className="text-green-600" />
                            </div>
                            <h4 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter italic leading-none">Enquiry Live!</h4>
                            <p className="text-sm text-slate-500 mt-4 px-4 font-medium">
                                हमने आपकी रिक्वेस्ट <span className="font-bold text-blue-600">{formData.area}</span> के एक्सपर्ट्स को भेज दी है। ५ मिनट में कॉल आएगा।
                            </p>
                            <button onClick={onClose} className="mt-12 bg-slate-900 text-white px-12 py-4 rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
                                DONE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}