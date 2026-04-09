"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Smartphone, Briefcase, Truck, Utensils,
    HeartPulse, Wrench, Globe, ShieldCheck,
    MapPin, Search, Scissors, Camera, GraduationCap,
    Building2, ChevronRight, Phone, Mail,
} from 'lucide-react';

export default function MegaFooter() {
    const router = useRouter();

    const quickLinks = [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Terms of Use", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Free Listing", path: "/free-listing" },
        { name: "Advertise", path: "/advertise" }
    ];

    const businessHub = [
        "B2B Solutions", "Doctors", "Real Estate", "Jobs", "Education",
        "Repairs", "Hotels", "Wedding", "Beauty & Spa", "Restaurants",
        "Automobiles", "Loans & GST", "Software", "Home Services"
    ];

    const trending = [
        "Packers & Movers Patna", "Wedding Photographers", "AC Service Experts",
        "Top Schools in Bihar", "Interior Designers", "Car Rentals",
        "Yoga Classes", "Gyms in Boring Road", "Pet Shops", "Electricians"
    ];

    const goToSearch = (q: string) => router.push(`/search-results?q=${encodeURIComponent(q)}`);

    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-20 relative font-sans text-slate-600">

            {/* --- 1. FLOATING SIDEBAR BUTTONS (Justdial Style) --- */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-1 hidden md:flex">
                <SideTab label="Advertise" color="bg-[#e65100]" onClick={() => router.push('/advertise')} />
                <SideTab label="Free Listing" color="bg-[#0076d7]" onClick={() => router.push('/free-listing')} />
                <SideTab label="Edit Listing" color="bg-[#7b1fa2]" onClick={() => router.push('/seller/login')} />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10">

                {/* --- 2. SEO SECTION --- */}
                <div className="mb-16">
                    <h2 className="text-2xl font-[1000] text-slate-800 uppercase tracking-tighter italic mb-4">
                        Bihar's Leading Local Business Directory
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed text-justify">
                        Welcome to <span className="font-bold text-blue-600">Vyapaar Seva</span>, the fastest-growing local search engine dedicated to Bihar.
                        We bridge the gap between users and local businesses by providing accurate information, real reviews, and instant connectivity.
                        Whether you need a Plumber, a Chartered Accountant, or the best Wedding Hall in Patna, Vyapaar Seva is your one-stop digital hub.
                        Digitalizing Bihar, empowering local entrepreneurs.
                    </p>
                </div>

                {/* --- 3. ICONIC SERVICES GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <FooterService onClick={() => goToSearch('B2B')} icon={<Briefcase />} title="Business B2B" desc="Connect with bulk manufacturers and wholesalers." />
                    <FooterService onClick={() => goToSearch('Doctors')} icon={<HeartPulse />} title="Health & Medical" desc="Find verified specialists and book appointments." />
                    <FooterService onClick={() => goToSearch('Repairs')} icon={<Wrench />} title="Home Repairs" desc="AC, Fridge, and Electrical experts at your door." />
                    <FooterService onClick={() => goToSearch('Real Estate')} icon={<Building2 />} title="Property Hub" desc="Buy, sell or rent residential and commercial spaces." />
                </div>

                {/* --- 4. CATEGORY CLOUD (Quick Access) --- */}
                <div className="py-10 border-t border-slate-100">
                    <h6 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 italic">Business Categories</h6>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {businessHub.map((item) => (
                            <span key={item} onClick={() => goToSearch(item)} className="text-[11px] font-bold text-slate-500 hover:text-blue-600 cursor-pointer uppercase transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- 5. TRENDING SEARCHES --- */}
                <div className="py-10 border-t border-slate-100">
                    <h6 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 italic">Trending in Patna</h6>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {trending.map((link) => (
                            <span key={link} onClick={() => goToSearch(link)} className="text-[10px] font-medium text-slate-400 hover:text-blue-600 cursor-pointer border-r border-slate-200 pr-6 last:border-0">
                                {link}
                            </span>
                        ))}
                    </div>
                </div>

                {/* --- 6. CORPORATE LINKS & APPS --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-16 border-t border-slate-100">
                    <div className="space-y-4">
                        <h6 className="font-black text-xs uppercase text-slate-800 tracking-widest">Company</h6>
                        {quickLinks.map(l => (
                            <p key={l.name} onClick={() => router.push(l.path)} className="text-[11px] font-bold text-slate-400 hover:text-blue-600 cursor-pointer">{l.name}</p>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <h6 className="font-black text-xs uppercase text-slate-800 tracking-widest">Connect</h6>
                        <div className="flex gap-4">
                        </div>
                        <div className="pt-4 space-y-2">
                            <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Phone size={12} /> +91 9229384100</p>
                            <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400"><Mail size={12} /> help@vyapaarseva.com</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col items-center md:items-end justify-end">
                        <h1 onClick={() => router.push('/')} className="text-3xl font-[1000] text-blue-600 tracking-tighter uppercase italic cursor-pointer">VYAPAAR SEVA</h1>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mt-3">Empowering Bihar © 2025</p>
                        <div className="mt-6 flex gap-3">
                            <div className="w-24 h-8 bg-black rounded-lg"></div> {/* Placeholder for App Store Badge */}
                            <div className="w-24 h-8 bg-black rounded-lg"></div> {/* Placeholder for Play Store Badge */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to top button */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="absolute bottom-10 right-10 bg-slate-800 text-white p-3 rounded-full shadow-xl hover:bg-black transition-all">
                <ChevronRight size={20} className="-rotate-90" />
            </button>
        </footer>
    );
}

// --- SUB-COMPONENTS ---

function SideTab({ label, color, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`${color} text-white px-3 py-6 cursor-pointer hover:translate-x-[-10px] transition-transform flex items-center justify-center rounded-l-2xl shadow-lg border-y border-l border-white/20`}
        >
            <span className="[writing-mode:vertical-lr] font-black uppercase text-[10px] tracking-widest">{label}</span>
        </div>
    );
}

function FooterService({ icon, title, desc, onClick }: any) {
    return (
        <div onClick={onClick} className="group cursor-pointer">
            <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    {icon}
                </div>
                <h4 className="font-black text-sm text-slate-800 uppercase italic tracking-tight">{title}</h4>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed group-hover:text-slate-500">{desc}</p>
        </div>
    );
}

function SocialIcon({ icon, link }: any) {
    return (
        <a href={link} target="_blank" className="w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100">
            {icon}
        </a>
    );
}