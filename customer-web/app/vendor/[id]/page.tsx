"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
    MapPin, Phone, Star, ShieldCheck, Globe, Clock, 
    Share2, Heart, ChevronRight, Award, Camera, Info, MessageSquare
} from 'lucide-react';
import JustdialHeader from '@/app/components/JustdialHeader';
import MegaFooter from '@/app/components/MegaFooter';

export default function VendorPublicProfile() {
    const params = useParams();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // ✅ १. मंतु भाई, यहाँ लाइव URL सेट कर दिया है
    const API_BASE = "https://api.vister.in/api";
    const IMAGE_BASE = "https://api.vister.in/uploads";

    useEffect(() => {
        if (params.id) {
            axios.get(`${API_BASE}/vendors/${params.id}`)
                .then(res => {
                    // अगर डेटा सीधा आ रहा है या .vendor के अंदर, दोनों को संभाला है
                    setVendor(res.data.vendor || res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase italic">Vyapaar Seva: Dukan khul rahi hai...</div>;
    
    if (!vendor) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10">
            <h2 className="text-2xl font-black text-slate-300 uppercase">Data nahi mil paya!</h2>
            <button onClick={() => router.push('/')} className="mt-4 text-blue-600 font-bold underline">Home Par Jayein</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <JustdialHeader onSearch={() => {}} />

            {/* --- २. फोटो गैलरी (Justdial Style) --- */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto flex h-[350px] md:h-[400px]">
                    <div className="flex-[2] bg-slate-100 relative overflow-hidden">
                        {vendor.shopImage ? (
                            <img src={`${IMAGE_BASE}/${vendor.shopImage}`} className="w-full h-full object-cover" alt="shop" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Camera size={80}/></div>
                        )}
                        <div className="absolute bottom-6 left-6 bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Verified Business</div>
                    </div>
                    <div className="flex-1 hidden md:flex flex-col gap-1 pl-1">
                        <div className="flex-1 bg-slate-200"><img src="https://images.unsplash.com/photo-1581092921461-7d156970aa3e?q=80&w=600" className="w-full h-full object-cover opacity-60" /></div>
                        <div className="flex-1 bg-blue-600 flex items-center justify-center text-white">
                             <Text style={{fontWeight:'900', fontSize: 24}}>+17 Photos</Text>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* बायाँ भाग: मुख्य जानकारी */}
                <div className="flex-[2.5] space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                    {vendor.shopName}
                                    {vendor.isVerified && <ShieldCheck className="text-blue-600" size={32}/>}
                                </h1>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="bg-green-700 text-white px-3 py-0.5 rounded-lg flex items-center gap-1 font-black text-sm">
                                        4.5 <Star size={12} fill="white"/>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">120 Ratings</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                             <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-[1000] uppercase text-xs shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95">
                                <Phone size={18}/> {vendor.phone}
                             </button>
                             <button className="border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-2xl font-[1000] uppercase text-xs active:bg-blue-50">Enquire Now</button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black mb-6 uppercase italic border-l-8 border-blue-600 pl-4">About this place</h3>
                        <p className="text-slate-500 font-medium leading-loose italic">
                            "{vendor.description || "Leading expert in Patna providing high-quality professional services since 2018."}"
                        </p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <InfoItem label="Area" value={vendor.area} />
                             <InfoItem label="City" value={vendor.city || "Patna"} />
                             <InfoItem label="Pincode" value={vendor.pincode} />
                             <InfoItem label="Speciality" value={vendor.keywords?.join(", ") || "General"} />
                        </div>
                    </div>
                </div>

                {/* दायाँ भाग: इंक्वायरी फॉर्म */}
                <div className="flex-1">
                    <div className="bg-slate-900 p-8 rounded-[3rem] sticky top-24 shadow-2xl text-white">
                        <h3 className="text-2xl font-black italic uppercase mb-2">Get Quote</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6 underline decoration-blue-500 underline-offset-4">Direct contact with {vendor.shopName}</p>
                        
                        <div className="space-y-4">
                            <input placeholder="Your Name" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white font-bold" />
                            <input placeholder="Mobile" className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white font-bold" />
                            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl mt-4 active:scale-95">Send Details</button>
                        </div>
                    </div>
                </div>
            </main>
            <MegaFooter />
        </div>
    );
}

const InfoItem = ({ label, value }: any) => (
    <div className="flex justify-between border-b border-slate-50 pb-3">
        <span className="text-[10px] font-black text-slate-400 uppercase">{label}</span>
        <span className="text-xs font-black text-slate-700 uppercase">{value}</span>
    </div>
);

// React Native style fix for web
const Text = ({ children, style }: any) => <span style={style}>{children}</span>;