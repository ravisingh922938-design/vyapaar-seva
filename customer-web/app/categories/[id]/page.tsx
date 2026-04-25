"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Star, Phone, ShieldCheck, ArrowLeft,
    Search, Loader2, Award, CheckCircle2, Images
} from 'lucide-react';
import JustdialHeader from '@/app/components/JustdialHeader';
import InquiryModal from '@/app/components/InquiryModal';

export default function CategoryListingPage() {
    const { id } = useParams();
    const [vendors, setVendors] = useState([]);
    const [categoryName, setCategoryName] = useState("Loading...");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // ✅ FIXED: Sahi URL format (Double /api hata diya)
    const API_BASE = "https://api.vister.in/api";
const IMAGE_BASE = "https://api.vister.in/uploads";

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // 1. Vendors fetch karein (Sahi Path: /api/vendors/search)
                const vendorRes = await axios.get(`${API_BASE}/vendors/search?categoryId=${id}`);
                setVendors(vendorRes.data || []);

                // 2. Category name fetch karein
                const catRes = await axios.get(`${API_BASE}/categories`);
                const currentCat = catRes.data.find((c: any) => c._id === id);
                if (currentCat) setCategoryName(currentCat.name);

            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#F1F3F6] font-sans text-slate-800 pb-20">
            <JustdialHeader onSearch={() => { }} />

            {/* --- TOP NAV --- */}
            <div className="bg-white border-b px-4 py-5 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
                <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h2 className="text-xl md:text-2xl font-[1000] text-slate-800 uppercase tracking-tighter italic">
                        {categoryName} <span className="text-blue-600 font-medium lowercase not-italic">in Patna</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Experts Only</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-40 flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-blue-600" size={50} />
                        <p className="text-slate-400 font-bold uppercase text-xs">Finding best sellers...</p>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200">
                        <Search size={64} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">Shayad yahan abhi koi seller nahi hai.</h3>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 font-bold underline">LEAVE ENQUIRY</button>
                    </div>
                ) : (
                    vendors.map((vendor: any) => (
                        <div key={vendor._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row p-6 md:p-10 gap-8">

                                {/* --- LEFT: PHOTO GALLERY --- */}
                                <div className="w-full md:w-80 space-y-2">
                                    <div className="h-56 bg-slate-50 rounded-[2rem] overflow-hidden relative border border-slate-100">
                                        {vendor.shopImage ? (
                                            <img
                                                src={`${IMAGE_BASE}/${vendor.shopImage}`}
                                                className="w-full h-full object-cover"
                                                alt="shop"
                                                onError={(e: any) => e.target.src = "https://via.placeholder.com/400x300?text=No+Image"}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 font-black text-6xl italic">
                                                {vendor.shopName?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                            <Award size={12} /> Top Rated
                                        </div>
                                    </div>
                                    {/* Small thumbnails (Static for now) */}
                                    <div className="flex gap-2 h-16">
                                        <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden opacity-60">
                                            {vendor.shopImage && <img src={`${IMAGE_BASE}/${vendor.shopImage}`} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 bg-slate-100 rounded-2xl flex items-center justify-center border border-dashed border-slate-300">
                                            <Images size={16} className="text-slate-300" />
                                        </div>
                                    </div>
                                </div>

                                {/* --- RIGHT: FULL DETAILS --- */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-3xl font-[1000] text-slate-900 uppercase italic tracking-tighter flex items-center gap-2">
                                                {vendor.shopName}
                                                {vendor.isVerified && <ShieldCheck className="text-blue-600" size={32} />}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 font-black text-xs">
                                                    4.8 <Star size={10} fill="white" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest underline">Verified Profile</span>
                                            </div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                                            <p className="text-2xl font-black text-blue-600 tracking-tighter italic">95%</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 italic border-l-4 border-blue-100 pl-4">
                                        "{vendor.description || "Leading expert providing quality services in your local area."}"
                                    </p>

                                    <div className="space-y-3 mb-10">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                            <p className="text-xs font-bold text-slate-600">
                                                <span className="uppercase">{vendor.area}</span>, Patna
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-5 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
                                            Connect Now
                                        </button>
                                        <button onClick={() => setIsModalOpen(true)} className="border-2 border-blue-600 text-blue-600 py-5 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.2em] hover:bg-blue-50 active:scale-95 transition-all">
                                            Get Best Quote
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </main>

            <InquiryModal
                selectedCat={{ _id: id, name: categoryName }}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}