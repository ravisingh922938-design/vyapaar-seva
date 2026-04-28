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

    // ✅ लाइव API URL (पुश करने के लिए इसे इस्तेमाल करें)
    const API_URL = "https://api.vister.in/api/leads/verify-lead";

    // डिस्प्ले के लिए नाम निकालें (चाहे ऑब्जेक्ट हो या स्ट्रिंग)
    const catDisplayName = typeof selectedCat === 'object' ? selectedCat?.name : selectedCat;

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

        if (!formData.name.trim() || formData.phone.length !== 10) {
            alert("Bhai, Naam aur 10 digit Mobile Number sahi se bhariye!");
            return;
        }

        setLoading(true);

        // ✅ मंतु भाई, यहाँ सुधार है: 
        // अगर selectedCat एक ऑब्जेक्ट है तो उसकी ID लो, वरना सीधा नाम भेजो
        const categoryValue = typeof selectedCat === 'object' ? (selectedCat?._id || selectedCat?.name) : selectedCat;

        const payload = {
            customerName: formData.name,
            customerPhone: formData.phone,
            area: formData.area,
            category: categoryValue, // अब ये खाली (undefined) नहीं जाएगा
            description: formData.purpose, // बैकएंड इसे description मांग रहा है
            fullAddress: formData.fullAddress
        };

        console.log("📤 Sending Lead Data:", payload);

        try {
            const res = await axios.post(API_URL, payload);
            if (res.status === 201 || res.status === 200) {
                setSubmitted(true);
            }
        } catch (err: any) {
            console.error("❌ Error Detail:", err.response?.data);
            alert("Galti hui! " + (err.response?.data?.message || "Check required fields"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <button onClick={onClose} className="absolute top-4 right-5 text-white/70 hover:text-white transition-all">
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">VYAPAAR SEVA</h3>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h4 className="text-xl font-bold text-center text-slate-700 uppercase italic">
                                Quotes for <span className="text-blue-600">{catDisplayName}</span>
                            </h4>

                            <div className="relative">
                                <input required placeholder="Aapka Naam" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <User size={18} className="absolute right-4 top-5 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required type="tel" maxLength={10} placeholder="10-Digit Mobile" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold"
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <Smartphone size={18} className="absolute right-4 top-5 text-slate-300" />
                            </div>

                            <div className="relative">
                                <input required placeholder="Kya kaam karwana hai?" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold"
                                    value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                                <MessageSquareText size={18} className="absolute right-4 top-5 text-slate-300" />
                            </div>

                            <div className="relative">
                                <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600 outline-none appearance-none"
                                    value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                                    <option value="Boring Road">Boring Road</option>
                                    <option value="Kankarbagh">Kankarbagh</option>
                                    <option value="Patliputra">Patliputra</option>
                                    <option value="Raja Bazar">Raja Bazar</option>
                                </select>
                                <MapPin size={16} className="absolute right-4 top-5 text-blue-500 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <textarea required rows={2} placeholder="Full Address / Landmark" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none resize-none font-bold"
                                    value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} />
                                <Home size={18} className="absolute right-4 top-5 text-slate-300" />
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase flex justify-center items-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                                {loading ? <Loader2 className="animate-spin" /> : "Submit Free Request"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <CheckCircle size={80} className="text-green-600 mx-auto mb-6 animate-bounce" />
                            <h4 className="text-3xl font-black italic uppercase text-slate-800 tracking-tighter">Request Sent!</h4>
                            <p className="text-sm text-slate-500 mt-4 font-bold uppercase leading-relaxed">
                                Experts for <span className="text-blue-600">{catDisplayName}</span> will call you soon.
                            </p>
                            <button onClick={onClose} className="mt-10 bg-slate-900 text-white px-12 py-4 rounded-full font-black uppercase text-xs shadow-2xl">
                                CLOSE
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}