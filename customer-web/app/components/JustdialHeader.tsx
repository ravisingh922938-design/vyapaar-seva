"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, MapPin, Mic, Bell,
    ChevronDown, Megaphone, LayoutGrid, Globe
} from 'lucide-react';

// Props Interface: ताकि होम पेज के आइकन्स फिल्टर हो सकें
interface HeaderProps {
    onSearch?: (val: string) => void;
}

export default function JustdialHeader({ onSearch }: HeaderProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // 1. रियल-टाइम सर्च (Home Page के आइकन्स के लिए)
    const handleInputChange = (val: string) => {
        setQuery(val);
        if (onSearch) {
            onSearch(val);
        }
    };

    // 2. फाइनल सर्च (बटन दबाने पर Search Results पेज पर जाने के लिए)
    const handleFinalSearch = (e?: any) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            router.push(`/search-results?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="w-full bg-white font-sans border-b border-slate-200">

            {/* --- 1. TOP MINI NAVIGATION --- */}
            <div className="hidden md:flex justify-end items-center px-10 py-1.5 gap-6 border-b border-slate-50">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium cursor-pointer hover:text-blue-600">
                    <Globe size={12} /> EN <ChevronDown size={10} />
                </div>

                {/* Hiring Button */}
                <span
                    onClick={() => router.push('/hiring')}
                    className="text-[11px] text-slate-500 font-medium cursor-pointer hover:text-blue-600 transition-colors"
                >
                    We are Hiring
                </span>

                <span className="text-[11px] text-slate-500 font-medium cursor-pointer hover:text-blue-600">
                    Investor Relations
                </span>

                {/* Leads Button (Points to Seller Login) */}
                <div
                    onClick={() => router.push('/seller/login')}
                    className="flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 rounded shadow-sm cursor-pointer hover:bg-slate-50 transition-all"
                >
                    <span className="text-[11px] font-bold text-slate-700">📢 Leads</span>
                </div>

                {/* Advertise Button */}
                <div
                    onClick={() => router.push('/advertise')}
                    className="flex items-center gap-1 text-[11px] text-slate-600 font-bold cursor-pointer hover:text-blue-600 transition-all"
                >
                    <Megaphone size={12} /> Advertise
                </div>

                {/* Free Listing Button */}
                <div className="relative cursor-pointer group" onClick={() => router.push('/free-listing')}>
                    <span className="absolute -top-3 left-0 bg-red-600 text-white text-[8px] px-1 font-black rounded uppercase scale-75">Business</span>
                    <span className="text-[11px] text-slate-600 font-bold flex items-center gap-1">
                        <LayoutGrid size={12} /> Free Listing
                    </span>
                </div>

                <Bell size={16} className="text-slate-400 cursor-pointer hover:text-blue-600" />
            </div>

            {/* --- 2. MAIN LOGO & LOGIN SECTION --- */}
            <div className="flex items-center justify-between px-4 md:px-10 py-3">
                <h1
                    onClick={() => router.push('/')}
                    className="text-2xl font-black text-blue-600 tracking-tighter cursor-pointer uppercase"
                >
                    VYAPAAR<span className="text-slate-800">SEVA</span>
                </h1>

                {/* Login Button */}
                <button
                    onClick={() => router.push('/auth')}
                    className="bg-[#0076d7] hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all shadow-md active:scale-95"
                >
                    Login / Sign Up
                </button>
            </div>

            {/* --- 3. THE SEARCH SECTION --- */}
            <div className="px-4 md:px-10 pb-6">
                <div className="max-w-4xl flex flex-col md:flex-row items-start md:items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800 shrink-0">
                        Search across <span className="text-blue-600 underline decoration-blue-200">10,000+</span> Businesses
                    </h2>

                    {/* Search Box Wrapper */}
                    <div className="flex-1 flex w-full border-[1px] border-slate-400 rounded-lg overflow-hidden shadow-sm focus-within:border-blue-500 focus-within:ring-2 ring-blue-50 transition-all">
                        {/* Location */}
                        <div className="flex items-center px-3 py-3 bg-white border-r border-slate-300 min-w-[180px]">
                            <MapPin size={16} className="text-slate-400 mr-2" />
                            <input
                                type="text"
                                value="Rampur Road, Patna"
                                className="text-xs font-bold outline-none text-slate-700 w-full cursor-default"
                                readOnly
                            />
                        </div>

                        {/* Search Input */}
                        <div className="flex-1 flex items-center px-4 bg-white">
                            <input
                                type="text"
                                placeholder="Search for Services (e.g. AC, Doctor, Photographer)..."
                                className="w-full py-2 outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFinalSearch(e)}
                            />
                            <Mic size={18} className="text-blue-500 cursor-pointer hover:scale-110 ml-2" />
                        </div>

                        {/* Orange Search Button */}
                        <button
                            onClick={() => handleFinalSearch()}
                            className="bg-[#ff6a00] hover:bg-orange-600 px-5 py-3 flex items-center justify-center transition-colors"
                        >
                            <Search size={20} color="white" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}