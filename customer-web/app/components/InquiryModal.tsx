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

    // ✅ FIXED: सिर्फ एक API URL रखें जो बैकएंड के सही रास्ते पर जाए
    const API_URL = "https://api.vister.in/api/vendors";

    // जब भी Modal खुले, सब कुछ रिसेट कर दें (Multi-Enquiry Fix)
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({ name: '', phone: '', area: 'Boring Road', fullAddress: '', purpose: '', otp: '' });
            setTimer(30);
            setLoading(false);
        }
    }, [isOpen]);

    // OTP के लिए टाइमर लॉजिक
    useEffect(() => {
        let interval: any;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    if (!isOpen) return null;

    // --- स्टेप 1: मोबाइल पर OTP भेजना ---
    const handleSendOTP = async (e?: any) => {
        if (e) e.preventDefault();

        // डेटा चेक करें
        if (!formData.name || formData.phone.length !== 10 || !formData.purpose || !formData.fullAddress) {
            alert("Kripya saari details (Naam, Phone, Purpose, Address) sahi se bhariye.");
            return;
        }

        setLoading(true);
        try {
            // ✅ सही रास्ता: https://api.vister.in/api/vendors/send-otp
            const res = await axios.post(`${API_URL}/send-otp`, { phone: formData.phone });
            console.log("Backend response:", res.data);
            setStep(2);
            setTimer(30);
        } catch (err: any) {
            console.error("AXIOS ERROR DETAILS:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.message || "Server se connect nahi ho paya. Backend chalu hai?";
            alert(`OTP Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // --- स्टेप 2: OTP वेरीफाई करना और लीड बनाना ---
    const handleVerify = async (e: any) => {
        e.preventDefault();
        if (formData.otp.length < 4) return alert("Kripya 4-digit OTP dalo.");

        setLoading(true);
        try {
            // ✅ सही रास्ता: https://api.vister.in/api/vendors/verify-lead
            await axios.post(`${API_URL}/verify-lead`, {
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
            console.error("Verify Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Galti! OTP sahi se check karke dalo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 font-sans text-slate-800">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300 border-[1px] border-slate-200">

                {/* --- HEADER --- */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-5 text-white/70 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">VYAPAAR SEVA</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Verified Patna Experts</p>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto no-scrollbar">

                    {/* --- चरण 1: ग्राहक विवरण फॉर्म --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="text-center mb-4">
                                <h4 className="text-xl font-bold text-slate-800">Enquiry for <span className="text-blue-600 underline">{selectedCat?.name}</span></h4>
                            </div>

                            <div className="relative">
                                <input required placeholder="Your Name" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                <User size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                                <Smartphone size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required placeholder="Purpose (e.g. AC Gas leakage)" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold"
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
                                <textarea required rows={2} placeholder="Full Address & Landmark" className="w-full p-4 bg-slate-50 border-[1px] border-slate-200 rounded-xl outline-none focus:border-blue-500 resize-none font-bold"
                                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} value={formData.fullAddress} />
                                <Home size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-[1000] uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-3">
                                {loading ? <Loader2 className="animate-spin" /> : "Verify via OTP"}
                            </button>
                        </form>
                    )}

                    {/* --- चरण 2: OTP सत्यापन --- */}
                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-8 text-center py-4">
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
                                    {loading ? "Verifying..." : "Confirm & Get Experts"}
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

                    {/* --- चरण 3: सफलता स्क्रीन --- */}
                    {step === 3 && (
                        <div className="text-center py-10">
                            <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
                                <CheckCircle size={56} className="text-green-600" />
                            </div>
                            <h4 className="text-3xl font-[1000] text-slate-800 uppercase tracking-tighter italic">Enquiry Live!</h4>
                            <p className="text-sm text-slate-500 mt-4 px-4 leading-relaxed font-medium">
                                हमने आपकी डिटेल्स <span className="font-bold text-blue-600">{formData.area}</span> के टॉप एक्सपर्ट्स को भेज दी हैं। वे आपको ५ मिनट में कॉल करेंगे।
                            </p>
                            <button onClick={onClose} className="mt-12 bg-slate-900 text-white px-12 py-4 rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                                DONE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}