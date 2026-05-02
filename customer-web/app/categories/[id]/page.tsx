"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin, Star, Phone, ShieldCheck, ArrowLeft,
    Search, Loader2, Award, Images, MessageSquare, Globe
} from 'lucide-react';
import JustdialHeader from '@/app/components/JustdialHeader';
import InquiryModal from '@/app/components/InquiryModal';

// बैकअप लिस्ट: ताकि m113 जैसी ID को उनका नाम मिल सके
const MEGA_SERVICES_DATA = [
    { _id: 'm1', name: 'AC Repair & Service' },
    { _id: 'm2', name: 'Plumber' },
    { _id: 'm3', name: 'Electrician' },
    { _id: 'm113', name: 'Manpower Agencies' },
    { _id: 'm16', name: 'Doctors' },
    { _id: 'm58', name: 'Lawyers' },
    { _id: 'm62', name: 'Real Estate' },
    { _id: 'm70', name: 'Restaurants' },
];

export default function CategoryListingPage() {
    const { id } = useParams();
    const router = useRouter();
    
    const [vendors, setVendors] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState("Loading...");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);

    const API_BASE = "https://api.vister.in/api";
    const IMAGE_BASE = "https://api.vister.in/uploads";

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                let fetchUrl = "";
                let displayName = "Services";

                if (typeof id === 'string' && id.startsWith('m')) {
                    const staticCat = MEGA_SERVICES_DATA.find(c => c._id === id);
                    displayName = staticCat ? staticCat.name : "Business";
                    setCategoryName(displayName);
                    fetchUrl = `${API_BASE}/vendors/search?query=${displayName}`;
                } else {
                    fetchUrl = `${API_BASE}/vendors/search?categoryId=${id}`;
                    try {
                        const catRes = await axios.get(`${API_BASE}/categories`);
                        const currentCat = catRes.data.find((c: any) => c._id === id);
                        if (currentCat) setCategoryName(currentCat.name);
                    } catch (e) { setCategoryName("Services"); }
                }

                const vendorRes = await axios.get(fetchUrl);
                setVendors(Array.isArray(vendorRes.data) ? vendorRes.data : []);

            } catch (err) {
                console.error("Fetch error:", err);
                setVendors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEnquiry = (e: React.MouseEvent, vendor: any) => {
        // ✅ नया सुधार: ईवेंट को कार्ड तक जाने से रोकें
        e.stopPropagation(); 
        setSelectedVendor(vendor);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F1F3F6] font-sans text-slate-800 pb-20">
            <JustdialHeader onSearch={() => { }} />

            <div className="bg-white border-b px-4 py-5 flex items-center gap-4 sticky top-0 z-50 shadow-sm">
                <button onClick={() => router.push('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={22} />
                </button>
                <div>
                    <h2 className="text-xl md:text-2xl font-[1000] text-slate-800 uppercase italic tracking-tighter leading-tight">
                        {categoryName} <span className="text-blue-600 font-medium lowercase not-italic">in Patna</span>
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Experts Only</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                {loading ? (
                    <div className="flex justify-center py-40 flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-blue-600" size={50} />
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">Finding best sellers...</p>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200">
                        <Search size={64} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-xl font-black text-slate-400 uppercase italic">Shayad yahan abhi koi seller nahi hai.</h3>
                        <button onClick={() => setIsModalOpen(true)} className="mt-6 text-blue-600 font-black underline decoration-2 underline-offset-8 text-xs uppercase">LEAVE ENQUIRY FOR US</button>
                    </div>
                ) : (
                    vendors.map((vendor: any) => (
                        // ✅ नया सुधार: कार्ड पर क्लिक करने पर वेंडर का प्रोफाइल पेज खुलेगा
                        <div 
                            key={vendor._id} 
                            onClick={() => router.push(`/vendor/${vendor._id}`)} 
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row p-6 md:p-10 gap-8">
                                <div className="w-full md:w-80">
                                    <div className="h-56 bg-slate-50 rounded-[2.5rem] overflow-hidden relative border border-slate-100">
                                        {vendor.shopImage ? (
                                            <img
                                                src={`${IMAGE_BASE}/${vendor.shopImage}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                alt="shop"
                                                onError={(e: any) => e.target.src = "https://via.placeholder.com/400x300?text=Vyapaar+Seva"}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 font-black text-6xl italic">
                                                {vendor.shopName?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        {vendor.isVerified && (
                                            <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                <ShieldCheck size={12} /> Verified
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-[1000] text-slate-900 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">
                                                {vendor.shopName}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="bg-green-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 font-black text-[10px]">
                                                    4.8 <Star size={10} fill="white" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">120 Ratings</span>
                                            </div>
                                        </div>
                                        <Award size={32} className="text-blue-600 opacity-20" />
                                    </div>

                                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 italic border-l-4 border-blue-50 pl-4 line-clamp-2">
                                        "{vendor.description || "Leading expert providing quality services in Patna and nearby areas."}"
                                    </p>

                                    <div className="flex items-start gap-2 mb-8">
                                        <MapPin size={18} className="text-blue-500 shrink-0" />
                                        <p className="text-xs font-black text-slate-600 uppercase">
                                            {vendor.area}, {vendor.city || 'Patna'}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex flex-col md:flex-row gap-4">
                                        <button 
                                            onClick={(e) => handleEnquiry(e, vendor)} 
                                            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                                        >
                                            Connect Now
                                        </button>
                                        <button 
                                            onClick={(e) => handleEnquiry(e, vendor)} 
                                            className="px-10 border-2 border-slate-100 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            <InquiryModal
                selectedCat={categoryName}
                vendorId={selectedVendor?._id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}