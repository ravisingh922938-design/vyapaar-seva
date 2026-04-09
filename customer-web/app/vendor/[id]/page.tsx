"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function VendorPublicProfile() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://10.243.86.238:5000/api";

    useEffect(() => {
        if (params.id) {
            axios.get(`${API_BASE}/vendors/${params.id}`)
                .then(res => { setData(res.data); setLoading(false); })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse text-xl">Dukan khul rahi hai...</div>;
    if (!data || !data.vendor) return <div className="p-20 text-center">Data nahi mil paya.</div>;

    const { vendor, reviews, offers } = data;

    // --- GOOGLE SEO STRUCTURED DATA (JSON-LD) ---
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": vendor.shopName,
        "description": vendor.description,
        "image": vendor.images?.[0] || "https://vister.in/default-shop.jpg",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Patna",
            "addressRegion": "Bihar",
            "streetAddress": vendor.area
        },
        "telephone": vendor.phone,
        "priceRange": "₹₹",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": reviews.length > 0 ? "4.5" : "0", // Calculation baad mein dynamic kar sakte hain
            "reviewCount": reviews.length.toString()
        }
    };

    return (
        <>
            {/* SEO Script for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-gray-50 pb-20">
                {/* 1. SHOP HEADER AREA */}
                <div className="bg-white border-b p-8 shadow-sm">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black text-gray-900">{vendor.shopName}</h1>
                                {vendor.kycStatus === 'Verified' && (
                                    <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">✓ VERIFIED</span>
                                )}
                            </div>
                            <p className="text-blue-600 font-bold text-lg mb-4">⭐⭐⭐⭐☆ ({reviews.length} Reviews)</p>
                            <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">{vendor.description}</p>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 min-w-[250px]">
                            <p className="text-sm font-bold text-blue-800 mb-1">📍 Location</p>
                            <p className="text-gray-700 mb-4">{vendor.area}, Patna</p>
                            <a href={`tel:${vendor.phone}`} className="block w-full text-center bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all">
                                📞 CALL NOW
                            </a>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 px-4">

                    {/* LEFT COLUMN: PRODUCTS & SERVICES */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* A. PRODUCT STORE */}
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tight">Available Products 🛒</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {vendor.services && vendor.services.length > 0 ? vendor.services.map((item: any, i: number) => (
                                    <div key={i} className="border border-gray-100 p-4 rounded-2xl bg-gray-50 hover:border-blue-500 transition-all cursor-pointer">
                                        <div className="h-32 bg-gray-200 rounded-xl mb-3 flex items-center justify-center text-3xl">📦</div>
                                        <p className="font-bold text-gray-800 text-sm">{item.serviceName}</p>
                                        <p className="text-green-600 font-black">₹{item.price}</p>
                                    </div>
                                )) : <p className="text-gray-400">No products listed yet.</p>}
                            </div>
                        </section>

                        {/* B. DETAILED SERVICES */}
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-black mb-6 text-gray-800 uppercase tracking-tight">Our Services & Rates 📋</h3>
                            <div className="flex flex-wrap gap-2">
                                {vendor.keywords && vendor.keywords.map((k: string, i: number) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold border border-blue-100">#{k}</span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: REVIEWS & OFFERS */}
                    <div className="space-y-8">
                        {/* C. ACTIVE OFFERS */}
                        {offers && offers.length > 0 && (
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-[2.5rem] text-white shadow-xl">
                                <h4 className="font-black text-xl mb-4 uppercase">Dhamaka Offers 🔥</h4>
                                {offers.map((o: any) => (
                                    <div key={o._id} className="bg-white/20 p-4 rounded-2xl mb-3 border border-white/30">
                                        <p className="text-2xl font-black">{o.discountValue} OFF</p>
                                        <p className="font-bold text-sm">{o.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* D. CUSTOMER REVIEWS */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <h4 className="text-xl font-black mb-6 text-gray-800">Reviews ⭐</h4>
                            <div className="space-y-6">
                                {reviews && reviews.length > 0 ? reviews.map((r: any) => (
                                    <div key={r._id} className="border-b border-gray-50 pb-4 last:border-0">
                                        <p className="font-bold text-gray-800">{r.customerName}</p>
                                        <p className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}</p>
                                        <p className="text-gray-600 text-sm italic mt-1">"{r.comment}"</p>
                                    </div>
                                )) : <p className="text-gray-400 italic">No reviews yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}