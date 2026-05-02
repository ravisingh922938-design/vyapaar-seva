"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, Star, ShieldCheck, ArrowLeft, Loader2, Search, Image as ImageIcon, Phone } from 'lucide-react';
import JustdialHeader from '../components/JustdialHeader';
import InquiryModal from '../components/InquiryModal';

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter(); // ✅ राउटर यहाँ डिफाइन है
    
    const categoryQuery = searchParams.get('category'); 
    const searchQuery = searchParams.get('q');
    const locationQuery = searchParams.get('location');
    const q = categoryQuery || searchQuery || ""; 

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_BASE = "https://api.vister.in/api"; 
    const IMAGE_BASE = "https://api.vister.in/uploads";

    useEffect(() => {
        const fetchResults = async () => {
            if (!q && !locationQuery) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/vendors/search`, {
                    params: { query: q, location: locationQuery || "" }
                });
                setResults(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Search Error:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [q, locationQuery]);

    useEffect(() => {
        let timer: any;
        if (!loading && results.length === 0 && q) {
            timer = setTimeout(() => {
                setIsModalOpen(true);
            }, 10000); 
        }
        return () => clearTimeout(timer);
    }, [loading, results, q]);

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            {/* ✅ मंतु भाई, यहाँ 'val' के नीचे से लाल लाइन हट जाएगी अगर स्टेप 2 सही करोगे */}
            <JustdialHeader onSearch={(val: string) => router.push(`/search-results?q=${val}`)} />

            <div className="bg-white border-b px-6 py-5 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
                <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                        Results for "<span className="text-blue-600">{q || locationQuery}</span>"
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Partners in Patna</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center py-40 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={50} />
                        <p className="font-black text-slate-400 uppercase text-xs tracking-widest animate-pulse">Searching Vyapaar Seva...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <Search size={64} className="mx-auto text-slate-100 mb-4" />
                        <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter">No Business Found</h3>
                        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-10 py-4 rounded-full font-[1000] uppercase text-xs shadow-lg active:scale-95 transition-all">LEAVE ENQUIRY NOW</button>
                    </div>
                ) : (
                    results.map((vendor: any) => (
                        <div 
                            key={vendor._id} 
                            onClick={() => router.push(`/vendor/${vendor._id}`)} 
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row hover:shadow-xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="w-full md:w-64 h-48 bg-slate-50 relative border-r">
                                {vendor.shopImage ? (
                                    <img src={`${IMAGE_BASE}/${vendor.shopImage}`} className="w-full h-full object-cover" alt="shop" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-100">
                                        <ImageIcon size={48} />
                                        <p className="text-[10px] font-black mt-2">NO IMAGE</p>
                                    </div>
                                )}
                                {vendor.isVerified && (
                                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg text-[9px] font-black uppercase">
                                        <ShieldCheck size={12} /> Verified
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-[1000] text-slate-800 uppercase italic tracking-tighter">{vendor.shopName}</h3>
                                        <div className="flex items-center gap-1 mt-2 text-slate-500 font-bold text-xs uppercase">
                                            <MapPin size={14} className="text-blue-500" />
                                            <span>{vendor.area}, {vendor.city || 'Patna'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg font-black text-xs flex items-center gap-1 shadow-md">
                                        4.5 <Star size={10} fill="white" />
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); router.push(`tel:${vendor.phone}`); }} 
                                        className="flex-1 bg-blue-600 text-white font-[1000] py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
                                    >
                                        Contact Now
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} 
                                        className="px-10 border-2 border-slate-100 text-slate-400 font-[1000] py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-slate-50"
                                    >
                                        Enquiry
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            <InquiryModal selectedCat={q} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>}>
            <SearchResultsContent />
        </Suspense>
    );
}