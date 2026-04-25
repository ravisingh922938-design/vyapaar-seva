"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Camera, Store, Tag, Phone, User, FileText,
    Loader2, CheckCircle, ArrowRight, Mail, Lock, MapPin, Globe, Hash
} from 'lucide-react';

export default function FreeListingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        shopName: '',
        category: '',
        city: '',       
        state: '',      
        area: '',        // ✅ नया फील्ड
        pincode: '',     // ✅ नया फील्ड
        fullAddress: '', 
        description: '', 
        image: null as File | null
    });

    const router = useRouter();

    // ✅ लाइव API URL 
    const API_BASE = "https://api.vister.in/api";
    

    // 1. Categories load करना
    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                const sorted = data.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));
                setCategories(sorted);
            })
            .catch(err => console.log("Cat Error:", err));
    }, []);

    const handleNextStep = (e: any) => {
        e.preventDefault();
        // ✅ सभी ज़रूरी फील्ड्स की चेकिंग
        if (!formData.email || !formData.password || !formData.category || !formData.city || !formData.area || !formData.pincode || !formData.phone) {
            return alert("Email, Password, Category, City, Area, Pincode aur Phone zaroori hai!");
        }
        setStep(2);
    };

    const handleFinalSubmit = async () => {
        if (!formData.image) return alert("Dukan ki ek photo zaroori hai!");

        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('shopName', formData.shopName);
            data.append('phone', formData.phone);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('category', formData.category);
            data.append('city', formData.city);         
            data.append('state', formData.state);       
            data.append('area', formData.area);         // ✅ बैकएंड को भेज रहे हैं
            data.append('pincode', formData.pincode);   // ✅ बैकएंड को भेज रहे हैं
            data.append('fullAddress', formData.fullAddress);
            data.append('description', formData.description || "Local business expert.");

            if (formData.image) {
                data.append('image', formData.image);
            }

            await axios.post(`${API_BASE}/vendors/register`, data);
            setStep(3);
        } catch (err: any) {
            // बैकएंड से आने वाला असली एरर मैसेज दिखाएँ
            alert(err.response?.data?.message || "Registration fail! Pincode aur Area check karein.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">

            <div className="max-w-3xl w-full text-center mb-8">
                <div className="flex justify-center mb-2"><Globe className="text-blue-600 animate-pulse" size={40}/></div>
                <h1 className="text-4xl font-[1000] text-blue-600 italic uppercase tracking-tighter">VYAPAAR SEVA</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">All India Business Directory</p>
            </div>

            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-white">

                {step < 3 && (
                    <div className="flex bg-slate-50 border-b text-[11px] font-black uppercase">
                        <div className={`flex-1 p-5 text-center ${step === 1 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>1. Shop Details</div>
                        <div className={`flex-1 p-5 text-center ${step === 2 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>2. Identity Proof</div>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-5">
                            <h2 className="text-2xl font-black mb-4 underline decoration-blue-500 underline-offset-8">Business Registration</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Shop/Business Name" className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold focus:border-blue-500 shadow-sm" onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} value={formData.shopName} />
                                <select required className="p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600 outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category}>
                                    <option value="">Select Category</option>
                                    {categories.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="email" placeholder="Login Email" className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold shadow-sm" onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
                                <input required type="password" placeholder="Set Password" className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold shadow-sm" onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Owner Name" className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold shadow-sm" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold shadow-sm" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                            </div>

                            {/* ✅ Area और Pincode जोड़ने के लिए नया सेक्शन */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input required placeholder="Locality / Area" className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl font-bold outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, area: e.target.value })} value={formData.area} />
                                    <MapPin size={18} className="absolute left-4 top-4 text-blue-500" />
                                </div>
                                <div className="relative">
                                    <input required type="number" placeholder="6-Digit Pincode" className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl font-bold outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} value={formData.pincode} />
                                    <Hash size={18} className="absolute left-4 top-4 text-blue-500" />
                                </div>
                            </div>

                            {/* City और State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Enter City" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, city: e.target.value })} value={formData.city} />
                                <input required placeholder="Enter State" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, state: e.target.value })} value={formData.state} />
                            </div>

                            <input placeholder="Full Address (House No, Street, Landmark)" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold outline-none shadow-sm" onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} value={formData.fullAddress} />

                            <textarea placeholder="Describe your services..." className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-medium shadow-sm" rows={2} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-[1000] uppercase shadow-lg flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 transition-all active:scale-95">
                                NEXT: UPLOAD SHOP PHOTO <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 text-center">
                            <h2 className="text-2xl font-black italic">UPLOAD SHOP PHOTO</h2>
                            <label className="cursor-pointer block h-72 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] overflow-hidden hover:border-blue-300 shadow-inner">
                                <input type="file" accept="image/*" hidden onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFormData({ ...formData, image: file });
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-300"><Camera size={50} /><p className="text-xs font-black mt-2 uppercase">SHOP FRONT PHOTO</p></div>}
                            </label>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">BACK</button>
                                <button onClick={handleFinalSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-full font-[1000] shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95">
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "COMPLETE LISTING"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-16 text-center space-y-6">
                            <CheckCircle size={100} className="text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-4xl font-black italic text-slate-800">SUCCESSFULLY REGISTERED!</h2>
                            <p className="text-slate-500 font-bold px-6 uppercase text-xs tracking-widest">Aapki dukan "Vyapaar Seva" All India Network par live ho gayi hai.</p>
                            <button onClick={() => router.push('/')} className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95">Back to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}