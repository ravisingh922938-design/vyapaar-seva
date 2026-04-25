"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Camera, Store, Tag, Phone, User, Loader2, CheckCircle, 
    ArrowRight, Mail, Lock, MapPin, Globe, Hash, 
    Wrench, Stethoscope, Zap, Scissors, Utensils, Laptop, Car, Home
} from 'lucide-react';

// ✅ आइकॉन का स्थानीय नक्शा (आइकॉन कभी गायब नहीं होंगे)
const iconMap: any = {
    "Plumber": Wrench,
    "Doctor": Stethoscope,
    "Electrician": Zap,
    "Tailor": Scissors,
    "Restaurant": Utensils,
    "AC Repair": Laptop,
    "Mechanic": Car,
    "Real Estate": Home,
    "Shop": Store,
    "Other": Tag
};

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
        categoryName: '',
        city: '',       
        state: '',      
        area: '',        
        pincode: '',     
        fullAddress: '', 
        description: 'Quality service provider in your area.', 
        image: null as File | null
    });

    const router = useRouter();
    const API_BASE = "https://api.vister.in/api";

    // 1. Categories load करना
    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setCategories(data);
            })
            .catch(err => console.log("Cat Fetch Error:", err));
    }, []);

    const handleNextStep = (e: any) => {
        e.preventDefault();
        // ✅ सख्त चेकिंग: पिनकोड ६ अक्षर का होना चाहिए और एरिया खाली नहीं होना चाहिए
        if (!formData.category) return alert("Kripya Category select karein!");
        if (formData.pincode.length !== 6) return alert("Sahi 6-digit Pincode bharein!");
        if (!formData.area) return alert("Area/Locality bharna zaroori hai!");
        
        setStep(2);
    };

    const handleFinalSubmit = async () => {
        if (!formData.image) return alert("Dukan ki photo zaroori hai!");
        setLoading(true);

        try {
            const data = new FormData();
            // ✅ बैकएंड को सारे ज़रूरी फील्ड्स भेज रहे हैं
            data.append('name', formData.name);
            data.append('shopName', formData.shopName);
            data.append('phone', formData.phone);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('category', formData.category);
            data.append('city', formData.city);         
            data.append('state', formData.state);       
            data.append('area', formData.area);         
            data.append('pincode', formData.pincode);   
            data.append('fullAddress', formData.fullAddress || formData.area);
            data.append('description', formData.description);

            if (formData.image) {
                data.append('image', formData.image);
            }

            await axios.post(`${API_BASE}/vendors/register`, data);
            setStep(3);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Registration fail! Data check karein.";
            alert("SERVER ERROR: " + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">
            
            <div className="max-w-5xl w-full text-center mb-8">
                <h1 className="text-4xl font-[1000] text-blue-600 italic uppercase tracking-tighter flex items-center justify-center gap-2">
                   <Globe size={32}/> VYAPAAR SEVA
                </h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">All India Business Registration</p>
            </div>

            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                
                {/* --- बायाँ भाग: कैटेगरी सिलेक्शन ग्रिड --- */}
                {step === 1 && (
                    <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r">
                        <h2 className="text-sm font-black uppercase text-slate-500 mb-4 flex items-center gap-2">
                            <Tag size={16}/> 1. Select Category
                        </h2>
                        <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                            {categories.map((cat: any) => {
                                const Icon = iconMap[cat.name] || Store;
                                const active = formData.category === cat._id;
                                return (
                                    <div key={cat._id} 
                                        onClick={() => setFormData({...formData, category: cat._id, categoryName: cat.name})}
                                        className={`p-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center border-2 transition-all 
                                        ${active ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-95' : 'bg-white border-white hover:border-blue-200'}`}>
                                        <Icon size={24} className={active ? 'text-white' : 'text-blue-500'} />
                                        <span className="text-[10px] font-black mt-2 text-center uppercase leading-tight">{cat.name}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* --- दायाँ भाग: फॉर्म डिटेल्स --- */}
                <div className="flex-1 p-8 md:p-12 bg-white">
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <h2 className="text-2xl font-black mb-4">Account Details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Shop Name" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} />
                                <input required placeholder="Owner Name" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="email" placeholder="Email" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input required type="password" placeholder="Password" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="tel" maxLength={10} placeholder="Mobile" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <input required placeholder="Locality / Area" className="p-4 bg-blue-50 border border-blue-100 rounded-2xl font-bold" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input required type="number" placeholder="Pincode" className="p-4 bg-blue-50 border border-blue-100 rounded-2xl font-bold" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                <input required placeholder="City" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                <input required placeholder="State" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 transition-all">
                                Next: Upload Photo <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {/* Step 2: Photo */}
                    {step === 2 && (
                        <div className="space-y-6 text-center max-w-md mx-auto">
                            <h2 className="text-2xl font-black italic">SHOP PHOTO</h2>
                            <label className="cursor-pointer block h-64 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden">
                                <input type="file" accept="image/*" hidden onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFormData({ ...formData, image: file });
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-slate-300"><Camera size={50} /><p className="font-black text-[10px] mt-2 uppercase">Click to Select Shop Photo</p></div>}
                            </label>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs">Back</button>
                                <button onClick={handleFinalSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-full font-black shadow-lg">
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "COMPLETE REGISTRATION"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="py-16 text-center space-y-6">
                            <CheckCircle size={100} className="text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-4xl font-black italic text-slate-800 uppercase">Success!</h2>
                            <p className="text-slate-500 font-bold px-6">Aapki dukan "Vyapaar Seva" par live ho gayi hai.</p>
                            <button onClick={() => router.push('/')} className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase text-xs">Back to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}