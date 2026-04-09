"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { MapPin, Phone, ShieldCheck, Star, Filter, ChevronRight } from 'lucide-react';

export default function SearchResults() {
    const params = useParams();
    const router = useRouter();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = "http://10.44.111.238:5000/api";// APNA IP CHECK KAREIN

    useEffect(() => {
        if (params.id) {
            axios.get(`${API_BASE}/vendors/search?categoryId=${params.id}`)
                .then(res => {
                    setVendors(res.data);
                    setLoading(false);
                })
                .catch(err => console.log(err));
        }
    }, [params.id]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- SMALL SEARCH HEADER --- */}
            <header className="bg-white border-b sticky top-0 z-50 p-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 onClick={() => router.push('/')} className="text-xl font-black text-blue-600 cursor-pointer">VYAPAAR SEVA</h1>
                    <div className="flex-1 max-w-2xl mx-10 hidden md:flex border rounded-full overflow-hidden bg-gray-50">
                        <input type="text" placeholder="Search in Patna..." className="flex-1 p-2 px-6 bg-transparent outline-none text-sm" />
                        <button className="bg-blue-600 text-white px-6 py-2 font-bold text-sm text-sm">SEARCH</button>
                    </div>
                    <button className="text-sm font-bold text-gray-600">Login</button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* --- LEFT SIDE: FILTERS (Justdial Style) --- */}
                <aside className="hidden lg:block space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Area in Patna</p>
                                {['Boring Road', 'Kankarbagh', 'Patliputra', 'Raja Bazar'].map(area => (
                                    <label key={area} className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
                                        <input type="checkbox" className="rounded text-blue-600" /> {area}
                                    </label>
                                ))}
                            </div>
                            <hr />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Ratings</p>
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" /> 4.0 + ⭐
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- RIGHT SIDE: VENDOR LIST --- */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Best Verified Experts in Patna</h2>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Dukaandaar dhoondh rahe hain...</div>
                    ) : vendors.length === 0 ? (
                        <div className="bg-white p-10 rounded-3xl text-center shadow-sm">
                            <p className="text-gray-500">Afsos! Is area mein abhi koi dukaandaar nahi mila.</p>
                            <button onClick={() => router.push('/')} className="mt-4 text-blue-600 font-bold underline">Wapas Jayein</button>
                        </div>
                    ) : (
                        vendors.map((v: any) => (
                            <div
                                key={v._id}
                                onClick={() => router.push(`/vendor/${v._id}`)}
                                className="bg-white p-2 rounded-3xl shadow-sm border border-transparent hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row overflow-hidden group"
                            >
                                {/* Image Section */}
                                <div className="w-full md:w-56 h-48 bg-gray-100 relative">
                                    <img
                                        src={v.images?.[0] || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=300"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {v.membershipPlan === 'Platinum' && (
                                        <div className="absolute top-2 left-2 bg-yellow-400 text-[8px] font-black px-2 py-1 rounded-md shadow-sm">PLATINUM</div>
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-black text-gray-800 mb-1 uppercase tracking-tight">{v.shopName}</h3>
                                        {v.isVerified && <ShieldCheck className="text-blue-600" size={24} />}
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            4.2 <Star size={10} fill="white" />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">120 Ratings</span>
                                    </div>

                                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-4">
                                        <MapPin size={14} /> {v.area}, Patna
                                    </p>

                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100">
                                            <Phone size={18} /> CONTACT
                                        </button>
                                        <button className="px-6 py-3 border-2 border-gray-100 text-gray-400 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-bold">
                                            DETAILS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}