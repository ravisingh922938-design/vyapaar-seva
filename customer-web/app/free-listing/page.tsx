"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    Camera, Store, Tag, Phone, User, FileText,
    Loader2, CheckCircle, ArrowRight, Mail, Lock, MapPin
} from 'lucide-react';

export default function FreeListingPage() {
    const [step, setStep] = useState(1); // 1: Details, 2: Photos, 3: Success
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        shopName: '',
        category: '',
        area: 'Boring Road',
        description: 'Patna local expert.',
        image: null as File | null
    });

    const router = useRouter();

    // ✅ LOCAL TESTING KE LIYE LOCALHOST USE KAREIN
    // Jab live karna ho tab "https://api.vister.in/api" kar dena
    const API_BASE = "http://localhost:5000/api";

    // 1. Categories load karna
    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => {
                const sorted = res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
                setCategories(sorted);
            })
            .catch(err => console.log("Cat Error:", err));
    }, []);

    // 2. Step 1 se Step 2 par jaane wala function
    const handleNextStep = (e: any) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.category || !formData.phone) {
            return alert("Email, Password, Category aur Phone zaroori hai!");
        }
        setStep(2);
    };

    // 3. Final Submit Logic (Email/Password ke saath)
    const handleFinalSubmit = async () => {
        if (!formData.image) return alert("Dukan ki ek photo zaroori hai!");

        setLoading(true);
        try {
            const data = new FormData();

            // ✅ SARE FIELDS KO APPEND KAR RAHE HAIN
            data.append('name', formData.name);
            data.append('shopName', formData.shopName);
            data.append('phone', formData.phone);
            data.append('email', formData.email);    // 🔥 Sabse zaroori
            data.append('password', formData.password); // 🔥 Sabse zaroori
            data.append('category', formData.category);
            data.append('area', formData.area);
            data.append('description', formData.description || "Patna local expert.");

            if (formData.image) {
                data.append('image', formData.image);
            }

            // Backend Call
            await axios.post(`${API_BASE}/vendors/register`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStep(3); // Success Screen
        } catch (err: any) {
            console.error("Register Error:", err.response?.data);
            alert(err.response?.data?.message || "Registration fail! Shayad Email ya Phone pehle se register hai.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center p-4 md:p-10 font-sans text-slate-800">

            <div className="max-w-2xl w-full text-center mb-8">
                <h1 className="text-4xl font-[1000] text-blue-600 italic uppercase tracking-tighter">VYAPAAR SEVA</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Patna Business Registration</p>
            </div>

            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* Status Bar */}
                {step < 3 && (
                    <div className="flex bg-slate-50 border-b text-[10px] font-[1000] uppercase">
                        <div className={`flex-1 p-5 text-center ${step === 1 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>1. Account Info</div>
                        <div className={`flex-1 p-5 text-center ${step === 2 ? 'text-blue-600 bg-white' : 'text-slate-300'}`}>2. Shop Photo</div>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {/* --- STEP 1: FORM --- */}
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <h2 className="text-2xl font-black mb-4">Dukan ki Jankari</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input required placeholder="Shop/Business Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} value={formData.shopName} />
                                    <Store size={18} className="absolute right-4 top-4 text-slate-300" />
                                </div>
                                <div className="relative">
                                    <select required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600 outline-none" onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category}>
                                        <option value="">Select Category</option>
                                        {categories.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input required type="email" placeholder="Login Email" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
                                    <Mail size={18} className="absolute right-4 top-4 text-slate-300" />
                                </div>
                                <div className="relative">
                                    <input required type="password" placeholder="Set Password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} />
                                    <Lock size={18} className="absolute right-4 top-4 text-slate-300" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input required placeholder="Owner Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                    <User size={18} className="absolute right-4 top-4 text-slate-300" />
                                </div>
                                <div className="relative">
                                    <input required type="tel" maxLength={10} placeholder="10-Digit Mobile" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} value={formData.phone} />
                                    <Phone size={18} className="absolute right-4 top-4 text-slate-300" />
                                </div>
                            </div>

                            <div className="relative">
                                <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600 appearance-none focus:border-blue-500" onChange={(e) => setFormData({ ...formData, area: e.target.value })} value={formData.area}>
                                    <option value="Boring Road">Boring Road</option>
                                    <option value="Kankarbagh">Kankarbagh</option>
                                    <option value="Patliputra">Patliputra</option>
                                    <option value="Raja Bazar">Raja Bazar</option>
                                </select>
                                <MapPin size={18} className="absolute right-4 top-4 text-slate-300" />
                            </div>

                            <textarea placeholder="Describe your services... (e.g. Best AC repair in Patna)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-medium resize-none" rows={2} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all">
                                Next: Upload Photo <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {/* --- STEP 2: PHOTO --- */}
                    {step === 2 && (
                        <div className="space-y-8 text-center">
                            <h2 className="text-2xl font-black">Shop Photo</h2>
                            <label className="cursor-pointer group block h-72 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] overflow-hidden hover:border-blue-300 transition-all">
                                <input type="file" accept="image/*" hidden onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFormData({ ...formData, image: file });
                                        setImagePreview(URL.createObjectURL(file));
                                    }
                                }} />
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <Camera size={48} className="text-slate-200 mb-2" />
                                        <span className="text-xs font-bold text-slate-400 uppercase">Click to Upload Photo</span>
                                    </div>
                                )}
                            </label>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-slate-100 rounded-full font-bold text-slate-400">Back</button>
                                <button onClick={handleFinalSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-full font-black shadow-lg shadow-green-100">
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "FINISH & PUBLISH"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: SUCCESS --- */}
                    {step === 3 && (
                        <div className="py-10 text-center space-y-6">
                            <CheckCircle size={80} className="text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter">SUCCESS!</h2>
                            <p className="text-sm text-slate-500 font-medium px-6">
                                Aapki dukan <span className="text-blue-600 font-bold">{formData.shopName}</span> register ho gayi hai.
                                <br /><br />Login as Seller using: <br /><b>{formData.email}</b>
                            </p>
                            <button onClick={() => router.push('/')} className="bg-slate-900 text-white px-12 py-4 rounded-full font-black uppercase text-xs shadow-xl active:scale-95">Back to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}