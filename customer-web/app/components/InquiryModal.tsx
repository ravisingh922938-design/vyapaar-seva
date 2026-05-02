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

    // ✅ लाइव API URL
    const API_URL = "https://api.vister.in/api/leads/verify-lead";

    // ✅ १. मंतु भाई, यहाँ चेक कर रहे हैं कि ये जनरल इंक्वायरी है या कैटेगरी वाली
    const catName = typeof selectedCat === 'object' ? (selectedCat?.name || "Vyapaar Seva") : (selectedCat || "Vyapaar Seva");
    const isGeneral = catName === "Vyapaar Seva";

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

        // कैटेगरी की वैल्यू सेट करना
        const categoryValue = typeof selectedCat === 'object' ? (selectedCat?._id || selectedCat?.name) : selectedCat;

        const payload = {
            customerName: formData.name,
            customerPhone: formData.phone,
            area: formData.area,
            category: categoryValue || "Vyapaar Seva", 
            description: formData.purpose,
            fullAddress: formData.fullAddress
        };

        try {
            const res = await axios.post(API_URL, payload);
            if (res.status === 201 || res.status === 200) {
                setSubmitted(true);
            }
        } catch (err: any) {
            console.error("❌ Error:", err.response?.data);
            alert("Galti hui! Check fields.");
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
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">VYAPAAR SEVA</h3>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* ✅ २. मंतु भाई, यहाँ टाइटल अब बदल जाएगा */}
                            <h4 className="text-xl font-bold text-center text-slate-700 uppercase italic">
                                {isGeneral ? "General Inquiry for " : "Quotes for "}
                                <span className="text-blue-600">{catName}</span>
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
                            
                            {/* ✅ ३. यहाँ मैसेज भी अब स्मार्ट दिखेगा */}
                            <p className="text-sm text-slate-500 mt-4 font-bold uppercase leading-relaxed text-center px-4">
                                {isGeneral 
                                    ? "Our team from Vyapaar Seva will call you soon." 
                                    : `Verified experts for ${catName} will call you soon.`
                                }
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