"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
    MapPin, Phone, Star, ShieldCheck, Globe, Clock, 
    Share2, Heart, ChevronRight, Award, Camera, Info, MessageSquare, Image as ImageIcon 
} from 'lucide-react';
import JustdialHeader from '@/app/components/JustdialHeader';
import MegaFooter from '@/app/components/MegaFooter';
import InquiryModal from '@/app/components/InquiryModal';

export default function VendorPublicProfile() {
    const params = useParams();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Popup control
    const router = useRouter();

    const API_BASE = "https://api.vister.in/api";
    const IMAGE_BASE = "https://api.vister.in/uploads";

    useEffect(() => {
        if (params.id) {
            axios.get(`${API_BASE}/vendors/${params.id}`)
                .then(res => {
                    setVendor(res.data.vendor || res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params.id]);

    // ✅ Enquiry Popup kholne ka function
    const openEnquiry = () => setIsModalOpen(true);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-600 animate-pulse uppercase italic">Vyapaar Seva: Profile Loading...</div>;
    
    if (!vendor) return <div className="min-h-screen flex items-center justify-center">Data nahi mil paya!</div>;

    // Photos ka jugad (Agar images array hai toh wo lo, varna main shopImage)
    const allPhotos = vendor.images && vendor.images.length > 0 ? vendor.images : [vendor.shopImage];

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <JustdialHeader onSearch={() => {}} />

            {/* --- 1. PHOTO GALLERY (Seller ki saari photos dikhayega) --- */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row h-[350px] md:h-[450px]">
                    {/* Main Big Photo */}
                    <div className="flex-[2] bg-slate-100 relative overflow-hidden group">
                        {allPhotos[0] ? (
                            <img src={`${IMAGE_BASE}/${allPhotos[0]}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="main-shop" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200"><Camera size={80}/></div>
                        )}
                        <div className="absolute top-6 left-6 bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Verified Business</div>
                    </div>

                    {/* Side Photos (Grid) */}
                    <div className="flex-1 hidden md:flex flex-col gap-1 pl-1">
                        <div className="flex-1 bg-slate-200 overflow-hidden">
                            {allPhotos[1] ? (
                                <img src={`${IMAGE_BASE}/${allPhotos[1]}`} className="w-full h-full object-cover opacity-90" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-black">VYAPAAR SEVA</div>
                            )}
                        </div>
                        <div className="flex-1 bg-slate-300 relative flex items-center justify-center overflow-hidden">
                            {allPhotos[2] ? (
                                <img src={`${IMAGE_BASE}/${allPhotos[2]}`} className="w-full h-full object-cover opacity-50" />
                            ) : (
                                <div className="absolute inset-0 bg-blue-700 opacity-80"></div>
                            )}
                            <TouchableOpacity className="z-10 flex flex-col items-center">
                                <ImageIcon color="white" size={30} />
                                <span className="text-white font-black text-xl mt-1">+{allPhotos.length > 3 ? allPhotos.length - 2 : "0"} Photos</span>
                            </TouchableOpacity>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* --- LEFT: DETAILS --- */}
                <div className="flex-[2.5] space-y-6">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-[1000] text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                    {vendor.shopName}
                                    {vendor.isVerified && <ShieldCheck className="text-blue-600" size={35}/>}
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
                             <button onClick={() => router.push(`tel:${vendor.phone}`)} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-[1000] uppercase text-xs shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                                <Phone size={18}/> {vendor.phone}
                             </button>
                             {/* ✅ ENQUIRE NOW Button Link Fix */}
                             <button 
                                onClick={openEnquiry} 
                                className="border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-2xl font-[1000] uppercase text-xs hover:bg-blue-50 transition-all"
                             >
                                ENQUIRE NOW
                             </button>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                        <h3 className="text-xl font-black mb-6 uppercase italic border-l-8 border-blue-600 pl-4 text-slate-700">About this place</h3>
                        <p className="text-slate-500 font-medium leading-relaxed italic text-lg mb-8">
                            "{vendor.description || "Leading professional service provider in Patna. Connect for best quality work and verified experts."}"
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                             <div className="flex justify-between"><span className="text-[10px] font-black text-slate-400 uppercase">AREA</span><span className="text-xs font-black text-slate-700 uppercase">{vendor.area}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-black text-slate-400 uppercase">CITY</span><span className="text-xs font-black text-slate-700 uppercase">{vendor.city || "Patna"}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-black text-slate-400 uppercase">PINCODE</span><span className="text-xs font-black text-slate-700 uppercase">{vendor.pincode}</span></div>
                             <div className="flex justify-between"><span className="text-[10px] font-black text-slate-400 uppercase">EXPERTISE</span><span className="text-xs font-black text-blue-600 uppercase">{vendor.category}</span></div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: STICKY FORM (Link Fix) --- */}
                <div className="flex-1">
                    <div className="bg-[#0f172a] p-8 rounded-[3rem] sticky top-24 shadow-2xl text-white">
                        <h3 className="text-2xl font-black italic uppercase mb-2">GET QUOTE</h3>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Direct Contact with {vendor.shopName}</p>
                        
                        <div className="space-y-4">
                            <TouchableOpacity onClick={openEnquiry} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer">
                                <span className="text-white/40 font-bold text-sm">Enter Your Name</span>
                                <ChevronRight size={16} className="text-white/20"/>
                            </TouchableOpacity>
                            <TouchableOpacity onClick={openEnquiry} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer">
                                <span className="text-white/40 font-bold text-sm">Enter Mobile</span>
                                <ChevronRight size={16} className="text-white/20"/>
                            </TouchableOpacity>

                            {/* ✅ Button Link Fix */}
                            <button 
                                onClick={openEnquiry}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-[1000] uppercase text-xs shadow-xl mt-4 active:scale-95 transition-all shadow-blue-500/20"
                            >
                                SEND DETAILS
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <MegaFooter />

            {/* ✅ INQUIRY MODAL (Isse Enquiry khulegi) */}
            <InquiryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                selectedCat={vendor.category} 
                vendorId={vendor._id}
            />
        </div>
    );
}

const TouchableOpacity = ({ children, onClick, className }: any) => (
    <div onClick={onClick} className={className}>{children}</div>
);