"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, Star, ShieldCheck, ArrowLeft, Loader2, Phone } from 'lucide-react';
import JustdialHeader from '../components/JustdialHeader';

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q'); // URL से सर्च शब्द निकालेगा
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    const API_BASE = "https://api.vister.in/api";

    useEffect(() => {
        if (q) {
            setLoading(true);
            // बैकएंड की सर्च API को कॉल करना
            axios.get(`${API_BASE}/vendors/search?query=${q}`)
                .then(res => {
                    setResults(res.data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, [q]);

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            <JustdialHeader />

            <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800">
                    Showing results for "<span className="text-blue-600">{q}</span>"
                </h2>
            </div>

            <main className="max-w-5xl mx-auto p-6 space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="font-bold text-slate-400 italic">Vyapaar Seva is searching...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter">No Business Found</h3>
                        <p className="text-slate-400 text-sm mt-2 font-bold">Try searching for something else like 'Photographer' or 'AC'</p>
                    </div>
                ) : (
                    results.map((vendor: any) => (
                        <div key={vendor._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                            {/* Shop Image */}
                            <div className="w-full md:w-48 h-36 bg-slate-100 rounded-3xl overflow-hidden">
                                {vendor.shopImage ? (
                                    <img src={`http://10.243.86.238:5000/uploads/${vendor.shopImage}`} className="w-full h-full object-cover" alt={vendor.shopName} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-4xl uppercase italic">{vendor.shopName.substring(0, 2)}</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter flex items-center gap-2">
                                            {vendor.shopName}
                                            {vendor.isVerified && <ShieldCheck size={20} className="text-blue-600" />}
                                        </h3>
                                        <p className="text-slate-500 font-bold text-sm flex items-center gap-1 mt-1">
                                            <MapPin size={14} /> {vendor.area}, Patna
                                        </p>
                                    </div>
                                    <div className="bg-green-600 text-white px-3 py-1 rounded-xl font-bold flex items-center gap-1 shadow-lg shadow-green-100">
                                        4.5 <Star size={12} fill="white" />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100">Contact Now</button>
                                    <button className="flex-1 border-2 border-blue-600 text-blue-600 font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest">Send Enquiry</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

// Next.js Search Params with Suspense is required
export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}