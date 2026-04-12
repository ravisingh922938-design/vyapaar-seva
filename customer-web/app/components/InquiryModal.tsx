"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CheckCircle, Loader2, MapPin, MessageSquareText, Home, User, Smartphone } from 'lucide-react';

export default function InquiryModal({ selectedCat, isOpen, onClose }: any) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        area: 'Boring Road',
        fullAddress: '',
        purpose: ''
    });

    // LOCALHOST BACKEND URL (Testing ke liye)
    const API_URL = "http://localhost:5000/api/leads/verify-lead";

    useEffect(() => {
        if (isOpen) {
            setSubmitted(false);
            setFormData({ name: '', phone: '', area: 'Boring Road', fullAddress: '', purpose: '' });
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // 1. Basic Validation
        if (!formData.name.trim() || formData.phone.length !== 10) {
            alert("Bhai, Naam aur 10 digit Mobile Number sahi se bhariye!");
            return;
        }

        setLoading(true);

        // 2. Data Mapping (Backend ke requirements ke mutabik)
        const payload = {
            customerName: formData.name,
            customerPhone: formData.phone,
            area: formData.area,

            // SAHI FIX: Category ki ID bhej rahe hain (BSON error solve karne ke liye)
            category: selectedCat?._id,

            message: `Work: ${formData.purpose} | Address: ${formData.fullAddress}`,
            otp: "1234" // Dummy OTP taki backend crash na ho
        };

        console.log("📤 Payload being sent:", payload);

        try {
            const res = await axios.post(API_URL, payload);

            if (res.status === 201 || res.status === 200) {
                setSubmitted(true);
            }
        } catch (err: any) {
            console.error("❌ Error Detail:", err.response?.data);
            alert("Galti hui! " + (err.response?.data?.message || "Backend connect nahi ho raha"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 p-6 text-white text-center">
                    <button onClick={onClose} className="absolute top-4 right-5 text-white/70 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black italic uppercase">VYAPAAR SEVA</h3>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h4 className="text-xl font-bold text-center text-slate-700">
                                Quotes for <span className="text-blue-600">{selectedCat?.name}</span>
                            </h4>

                            {/* Name Input */}
                            <div className="relative">
                                <input required placeholder="Aapka Naam" className="w-full p-4 bg-slate-50 border rounded-xl outline-none font-bold"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <User size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            {/* Phone Input */}
                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 border rounded-xl outline-none font-bold"
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <Smartphone size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            {/* Purpose Input */}
                            <div className="relative">
                                <input required placeholder="Kya kaam karwana hai?" className="w-full p-4 bg-slate-50 border rounded-xl outline-none font-bold"
                                    value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                                <MessageSquareText size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            {/* Area Select */}
                            <div className="relative">
                                <select className="w-full p-4 bg-slate-50 border rounded-xl font-bold text-slate-600 outline-none appearance-none"
                                    value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                                    <option value="Boring Road">Boring Road</option>
                                    <option value="Kankarbagh">Kankarbagh</option>
                                    <option value="Patliputra">Patliputra</option>
                                    <option value="Raja Bazar">Raja Bazar</option>
                                </select>
                                <MapPin size={16} className="absolute right-4 top-4 text-slate-300 pointer-events-none" />
                            </div>

                            {/* Address Textarea */}
                            <div className="relative">
                                <textarea required rows={2} placeholder="Landmark & Full Address" className="w-full p-4 bg-slate-50 border rounded-xl outline-none resize-none font-bold"
                                    value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} />
                                <Home size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            {/* Submit Button */}
                            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase flex justify-center items-center gap-3 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                                {loading ? <Loader2 className="animate-spin" /> : "Submit Free Request"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <CheckCircle size={80} className="text-green-600 mx-auto mb-6 animate-bounce" />
                            <h4 className="text-3xl font-black italic uppercase text-slate-800">Sent Successfully!</h4>
                            <p className="text-sm text-slate-500 mt-4 px-4 font-medium leading-relaxed">
                                Dhanyawad! Patna ke <span className="font-bold text-blue-600">{selectedCat?.name}</span> experts aapko jald call karenge.
                            </p>
                            <button onClick={onClose} className="mt-8 bg-slate-900 text-white px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest active:scale-95 transition-all">
                                DONE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}