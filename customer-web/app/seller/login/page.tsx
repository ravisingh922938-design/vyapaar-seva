"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Smartphone, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';

export default function SellerWebLogin() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // --- सुधार 1: localhost की जगह 127.0.0.1 का उपयोग (Network Error से बचने के लिए) ---
    const API_BASE = "http://127.0.0.1:5000/api";

    const handleSendOTP = async (e: any) => {
        e.preventDefault();
        if (phone.length !== 10) return alert("10-digit number dalo bhai!");

        setLoading(true);
        console.log("OTP bhejna shuru... Phone:", phone);

        try {
            // बैकएंड की API कॉल
            const response = await axios.post(`${API_BASE}/vendors/send-otp`, { phone });
            console.log("Server Response:", response.data);
            setStep(2);
        } catch (err: any) {
            console.error("AXIOS ERROR:", err);
            alert(`Galti: ${err.response?.data?.message || "Server se connect nahi ho paya. Backend check karein!"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: any) => {
        e.preventDefault();
        setLoading(false); // Testing ke liye loading false rakha hai

        // मंटू भाई, यहाँ ध्यान दें: 
        // अभी हमने असली OTP वेरिफिकेशन नहीं लगाया है, तो टर्मिनल में जो OTP दिखे, 
        // उसे डालकर 'Enter' दबाने पर यह आगे बढ़ जाएगा।

        setLoading(true);
        try {
            // यहाँ हम वेंडर को उसके फोन नंबर से ढूंढ रहे हैं
            const res = await axios.get(`${API_BASE}/vendors/search?query=${phone}`);

            if (res.data.length > 0) {
                const seller = res.data[0];
                console.log("Seller Found:", seller.shopName);

                // ब्राउज़र की याददाश्त (Memory) में डेटा सेव करना
                localStorage.setItem('sellerId', seller._id);
                localStorage.setItem('sellerName', seller.shopName);
                localStorage.setItem('sellerPhone', seller.phone);

                alert("Login Successful!");
                router.push('/seller/dashboard'); // डैशबोर्ड पर ले जाएँ
            } else {
                alert("Ye number register nahi hai. Pehle Free Listing karein.");
            }
        } catch (err) {
            alert("Verification Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in duration-500">

                <div className="bg-blue-600 p-10 text-center text-white">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">SELLER LOGIN</h2>
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Vyapaar Seva Business Portal</p>
                </div>

                <div className="p-10">
                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Registered Mobile</label>
                                <input required type="tel" maxLength={10} placeholder="9229XXXXXX"
                                    className="w-full p-4 bg-slate-50 border rounded-2xl outline-none mt-1 focus:border-blue-500 font-bold text-slate-700"
                                    onChange={(e) => setPhone(e.target.value)} />
                                <Smartphone size={18} className="absolute right-4 top-10 text-slate-300" />
                            </div>
                            <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6 text-center">
                            <ShieldCheck size={48} className="text-blue-600 mx-auto" />
                            <div>
                                <h4 className="text-xl font-bold text-slate-800 tracking-tight">Verification</h4>
                                <p className="text-xs text-slate-500 mt-1">Sent to +91-{phone}</p>
                            </div>
                            <input required type="text" maxLength={4} placeholder="0 0 0 0"
                                className="w-44 text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl border-2 border-blue-500 outline-none tracking-widest text-blue-600 shadow-inner"
                                onChange={(e) => setOtp(e.target.value)} />
                            <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg shadow-green-100 active:scale-95 transition-all">
                                {loading ? "Connecting..." : "Verify & Enter Dashboard"}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-[10px] font-black uppercase underline block mx-auto mt-4">Change Number</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}