"use client";
import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation'; // ✅ useSearchParams जोड़ा गया
import { 
    MapPin, Star, ChevronRight, Info, HelpCircle, 
    ShieldCheck, Search, ArrowRight, Utensils, Zap, Wrench, Laptop, Globe 
} from 'lucide-react';
import JustdialHeader from '../../components/JustdialHeader';
import MegaFooter from '../../components/MegaFooter';
import { getCategoryStyle } from '../../../utils/iconHelper';

export default function ServiceDiscoveryPage() {
    const { slug } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // ✅ १. होमपेज से भेजी गई ID या नाम यहाँ से पकडेंगे
    const cid = searchParams.get('cid'); 

    // slug को नाम में बदलना (ac-repair -> AC Repair)
    const name = (slug as string).replace(/-/g, ' ');
    const serviceName = name.charAt(0).toUpperCase() + name.slice(1);
    const style = getCategoryStyle(serviceName);

    // ✅ २. SCO/SEO के लिए कलेक्शंस
    const collections = [
        { title: "Top Rated", items: ["Best in Patna", "Verified Experts", "Emergency Service", "5 Star Rated"] },
        { title: "Local Favorites", items: ["Boring Road", "Kankarbagh", "Patliputra", "Raja Bazar"] },
        { title: "Specializations", items: [`Fast ${serviceName}`, "Low Cost", "Home Visit", "Instant Booking"] },
        { title: "Price Info", items: ["Price List", "Compare Charges", "Free Inspection", "Seasonal Offers"] },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            <JustdialHeader onSearch={() => {}} />

            {/* --- 1. HERO SECTION --- */}
            <div className="relative bg-[#1a2b4b] h-64 md:h-80 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 z-0"></div>
                <div className="z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-[1000] text-white uppercase italic tracking-tighter mb-4">
                        IT'S ALL ABOUT {serviceName}
                    </h1>
                    <div className="flex gap-4 justify-center">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 flex items-center gap-2">
                             <Globe size={16} className="text-white"/>
                             <span className="text-white font-bold text-[10px] uppercase tracking-widest">Patna verified Experts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. QUICK ACTION BAR --- */}
            <div className="max-w-5xl mx-auto -mt-10 grid grid-cols-3 gap-3 px-4 relative z-20">
                {[
                    { label: 'Check Price', sub: 'Instant Quotes', color: 'text-orange-500' },
                    { label: 'Trending', sub: 'Most Hired', color: 'text-red-500' },
                    { label: 'Top Sellers', sub: 'Verified Only', color: 'text-blue-500' }
                ].map((act, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl shadow-2xl border-[1px] border-slate-100 flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-all">
                        <div className={`${act.color} mb-2`}><Info size={24}/></div>
                        <p className="text-[10px] font-black uppercase tracking-tighter">{act.label}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">{act.sub}</p>
                    </div>
                ))}
            </div>

            {/* --- 3. KEYWORD COLLECTIONS (SEO Grid) --- */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                {collections.map((group, i) => (
                    <div key={i} className="bg-white border-[1px] border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all">
                        <h3 className="font-black text-slate-800 mb-5 pb-2 border-b flex justify-between items-center text-xs uppercase tracking-tighter">
                            {group.title} <ChevronRight size={14} className="text-blue-600"/>
                        </h3>
                        <ul className="space-y-4">
                            {group.items.map((item, idx) => (
                                <li key={idx} 
                                    onClick={() => router.push(`/search-results?q=${encodeURIComponent(item + " " + serviceName)}`)}
                                    className="text-[11px] font-bold text-slate-400 hover:text-blue-600 cursor-pointer flex items-center gap-2 group"
                                >
                                    <span className="w-1 h-1 bg-slate-200 group-hover:bg-blue-600 rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-[9px] font-black text-blue-600 uppercase cursor-pointer hover:underline">+ View More</p>
                    </div>
                ))}
            </div>

            {/* ✅ ४. मंतु भाई, ये है वो बटन जो 'cid' लेकर असली दुकान दिखाएगा */}
            <div className="flex justify-center mb-20 px-6">
                <button 
                   onClick={() => router.push(`/search-results?category=${encodeURIComponent(cid || serviceName)}`)}
                   className="w-full max-w-2xl bg-blue-600 text-white py-6 rounded-full font-[1000] uppercase shadow-2xl hover:bg-blue-700 transition-all text-sm tracking-widest active:scale-95"
                >
                    View All {serviceName} Listings in Patna
                </button>
            </div>

            {/* --- 5. SEO ARTICLE --- */}
            <div className="bg-slate-50 py-20 px-6 border-y">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 border-l-8 border-blue-600 pl-4">
                        Hire the Best {serviceName} Professionals in Patna
                    </h2>
                    <p className="text-sm font-medium text-slate-600 leading-loose mb-6">
                        Searching for reliable <b>{serviceName}</b> in Patna? You've come to the right place. Vyapaar Seva connects you with top-rated, background-verified experts near you. 
                        Whether you need a quick repair or a complete installation, our partners in Boring Road, Kankarbagh, and Patliputra are ready to help.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h4 className="font-black uppercase text-blue-600 text-xs mb-3">100% Quality Assurance</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                                Every professional on our platform is hand-picked after a thorough verification of their skills and customer feedback.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h4 className="font-black uppercase text-blue-600 text-xs mb-3">Affordable Pricing</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                                Get multiple quotes from different providers and choose the one that fits your budget without compromising on quality.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 6. FAQ --- */}
            <div className="max-w-4xl mx-auto py-20 px-6 mb-10">
                <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic uppercase">
                    <HelpCircle className="text-blue-600" size={30}/> FAQ's
                </h2>
                <div className="space-y-8">
                    {[
                        `How to book a ${serviceName} expert?`,
                        `Is there any insurance for the service?`,
                        "How can I register my business on Vyapaar Seva?"
                    ].map((q, i) => (
                        <div key={i} className="border-b-[1px] border-slate-100 pb-6">
                            <p className="font-black text-slate-800 text-sm mb-3">{i+1}. {q}</p>
                            <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                                Simply use our search tool or click on 'Connect Now' on the vendor profile. You can also leave an enquiry, and we will find the best match for you within 30 minutes.
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <MegaFooter />
        </div>
    );
}