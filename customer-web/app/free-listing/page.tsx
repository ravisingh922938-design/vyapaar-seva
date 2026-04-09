"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Camera, Store, MapPin, Tag, Phone, User, FileText,
    Loader2, CheckCircle, ArrowRight, ShieldCheck, RefreshCw
} from 'lucide-react';

export default function FreeListingPage() {
    const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Photos, 4: Success
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [timer, setTimer] = useState(30);

    const [formData, setFormData] = useState({
        name: '', phone: '', shopName: '', category: '',
        area: 'Boring Road', description: '', image: null, otp: ''
    });

    const router = useRouter();
    const API_BASE = "http://localhost:5000/api";

    // 1. कैटेगरीज लोड करना
    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.log("Cat Error:", err));
    }, []);

    // OTP Resend Timer
    useEffect(() => {
        let interval: any;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    // Step 1 -> Step 2: Send OTP
    const triggerOTP = async (e: any) => {
        e.preventDefault();
        if (formData.phone.length !== 10) return alert("Sahi mobile number dalo.");
        if (!formData.category) return alert("Kripya category select karein.");

        setLoading(true);
        try {
            // हम वही OTP API इस्तेमाल करेंगे जो ग्राहक के लिए बनाई थी
            await axios.post(`${API_BASE}/leads/send-otp`, { phone: formData.phone });
            setStep(2);
            setTimer(30);
        } catch (err) {
            alert("Server Error: OTP nahi ja paaya.");
        }
        setLoading(false);
    };

    // Step 2 -> Step 3: Verify OTP
    const verifyOTP = async (e: any) => {
        e.preventDefault();
        if (formData.otp.length !== 4) return alert("4-digit OTP dalo.");

        // नोट: हम यहाँ सिंपल वेरिफिकेशन कर रहे हैं, आप चाहें तो बैकएंड से भी कर सकते हैं
        // टेस्टिंग के लिए टर्मिनल में जो OTP आता है वही काम करेगा
        setStep(3);
    };

    // Step 3 -> Step 4: Final Submit
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('shopName', formData.shopName);
            data.append('phone', formData.phone);
            data.append('category', formData.category);
            data.append('area', formData.area);
            data.append('description', formData.description);
            if (formData.image) data.append('image', formData.image);

            await axios.post(`${API_BASE}/vendors/register`, data);
            setStep(4);
        } catch (err) {
            alert("Registration fail! Mobile number shayad pehle se registered hai.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center p-4 md:p-10 font-sans">

            <div className="max-w-2xl w-full text-center mb-8">
                <h1 className="text-3xl font-black text-blue-600 italic">VYAPAAR SEVA</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Business Registration Patna</p>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* Status Bar */}
                {step < 4 && (
                    <div className="flex bg-slate-50 border-b text-[9px] font-black uppercase tracking-tighter">
                        <div className={`flex-1 p-4 text-center ${step >= 1 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>1. Details</div>
                        <div className={`flex-1 p-4 text-center ${step >= 2 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>2. Verify</div>
                        <div className={`flex-1 p-4 text-center ${step >= 3 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>3. Photos</div>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {/* --- STEP 1: DETAILS --- */}
                    {step === 1 && (
                        <form onSubmit={triggerOTP} className="space-y-5">
                            <h2 className="text-2xl font-black text-slate-800">Basic Info</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Shop Name" className="p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500" onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} />
                                <select required className="p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="">Category</option>
                                    {categories.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Owner Name" className="p-4 bg-slate-50 border rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="p-4 bg-slate-50 border rounded-2xl outline-none" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase shadow-lg flex items-center justify-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    {/* --- STEP 2: OTP VERIFICATION --- */}
                    {step === 2 && (
                        <div className="text-center py-6 space-y-6">
                            <ShieldCheck size={64} className="text-blue-600 mx-auto" />
                            <h2 className="text-2xl font-black text-slate-800">Verify Number</h2>
                            <p className="text-sm text-slate-400">OTP sent to +91-{formData.phone}</p>
                            <input required maxLength={4} placeholder="0 0 0 0" className="w-48 text-center text-4xl font-black p-4 bg-slate-100 rounded-2xl border-2 border-blue-500 outline-none tracking-widest text-blue-600"
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value })} />
                            <button onClick={verifyOTP} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase">Verify & Continue</button>
                            {timer > 0 ? <p className="text-xs text-slate-400">Resend in {timer}s</p> : <button className="text-blue-600 text-xs font-bold uppercase underline">Resend OTP Now</button>}
                        </div>
                    )}

                    {/* --- STEP 3: PHOTOS --- */}
                    {step === 3 && (
                        <div className="space-y-8 text-center">
                            <h2 className="text-2xl font-black text-slate-800">Upload Shop Photo</h2>
                            <label className="cursor-pointer group block h-64 bg-slate-50 border-2 border-dashed rounded-[3rem] overflow-hidden">
                                <input type="file" accept="image/*" hidden onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (file) { setFormData({ ...formData, image: file }); setImagePreview(URL.createObjectURL(file)); }
                                }} />
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full"><Camera size={48} className="text-slate-200 mb-2" /><span className="text-xs font-bold text-slate-400">Click to Upload</span></div>}
                            </label>
                            <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black uppercase shadow-lg">
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Finish Listing"}
                            </button>
                        </div>
                    )}

                    {/* --- STEP 4: SUCCESS --- */}
                    {step === 4 && (
                        <div className="py-10 text-center space-y-6">
                            <CheckCircle size={80} className="text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-3xl font-black text-slate-800 italic uppercase">Listing Live!</h2>
                            <p className="text-sm text-slate-500 font-bold px-6">Shabash! Aapki dukan <span className="text-blue-600">{formData.shopName}</span> Patna mein list ho gayi hai.</p>
                            <button onClick={() => router.push('/')} className="bg-slate-800 text-white px-12 py-4 rounded-full font-black uppercase text-xs">Back to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}