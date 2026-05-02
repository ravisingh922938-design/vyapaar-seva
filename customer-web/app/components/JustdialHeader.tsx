"use client";
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, Mic, Menu, User, Navigation, 
  Megaphone, Bell, Briefcase, TrendingUp, Globe 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JustdialHeader({ onSearch }: any) {
  const [location, setLocation] = useState("Detecting Location...");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // ✅ 1. LIVE LOCATION LOGIC (Reverse Geocoding)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address.city || data.address.suburb || data.address.state || "Patna";
          setLocation(city);
        } catch (error) {
          setLocation("Patna, Bihar");
        }
      }, () => setLocation("Patna, Bihar"));
    }
  }, []);

  const handleSearchTrigger = () => {
    if (searchValue.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchValue)}`);
      if (onSearch) onSearch(searchValue);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-[100] shadow-sm font-sans">
      
      {/* --- ROW 1: MINI UTILITY NAV (Desktop Only) --- */}
      <div className="hidden md:flex bg-slate-50 border-b border-slate-100 py-1.5 px-6 justify-end items-center gap-6">
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
            <Globe size={12} className="text-slate-400"/>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">EN</span>
        </div>
        <span onClick={() => router.push('/hiring')} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter cursor-pointer hover:text-blue-600">We are Hiring</span>
        <span onClick={() => router.push('/investor')} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter cursor-pointer hover:text-blue-600">Investor Relations</span>
        
        {/* LEADS BUTTON (Skip nahi kiya) */}
        <div onClick={() => router.push('/leads')} className="flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-full border border-slate-200 hover:bg-red-50">
            <Bell size={12} className="text-red-500"/>
            <span className="text-[10px] font-[1000] text-slate-700 uppercase tracking-tighter">Leads</span>
        </div>

        {/* ADVERTISE BUTTON */}
        <div onClick={() => router.push('/advertise')} className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <Megaphone size={12} className="text-slate-400"/>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Advertise</span>
        </div>

        {/* FREE LISTING BUTTON */}
        <div onClick={() => router.push('/free-listing')} className="flex items-center gap-1 cursor-pointer bg-blue-600 px-3 py-1 rounded-full shadow-lg shadow-blue-100">
            <TrendingUp size={12} className="text-white"/>
            <span className="text-[10px] font-[1000] text-white uppercase tracking-tighter">Free Listing</span>
        </div>
      </div>

      {/* --- ROW 2: LOGO & LOGIN --- */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Menu className="md:hidden text-slate-600" size={24} />
          <div onClick={() => router.push('/')} className="cursor-pointer">
             <h1 className="text-2xl font-[1000] text-blue-600 italic tracking-tighter uppercase leading-none">VYAPAARSEVA</h1>
             <p className="text-[8px] font-black text-slate-400 tracking-[0.3em] uppercase hidden md:block">India's Local Search Engine</p>
          </div>
        </div>

        {/* LOGIN BUTTON (Action added) */}
        <button 
          onClick={() => router.push('/auth')} 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <User size={18} />
          <span className="font-black text-xs uppercase tracking-tight">Login / Sign Up</span>
        </button>
      </div>

      {/* --- ROW 3: SEARCH & LOCATION (Responsive) --- */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          
          {/* Location Box */}
          <div className="md:w-1/3 flex items-center bg-slate-50 p-3.5 rounded-2xl md:rounded-l-2xl md:rounded-r-none border border-slate-200">
            <MapPin size={18} className="text-blue-600 mr-2 shrink-0" />
            <div className="flex-1">
               <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-0.5">Location</p>
               <p className="text-xs font-black text-slate-700 truncate">{location}</p>
            </div>
            <Navigation size={14} className="text-blue-500 ml-2 animate-pulse" />
          </div>

          {/* Search Box */}
          <div className="flex-1 flex items-center bg-white border-2 border-slate-200 p-1.5 rounded-2xl md:rounded-r-2xl md:rounded-l-none md:border-l-0">
            <input 
              className="flex-1 px-3 text-sm font-bold outline-none text-slate-800 placeholder:text-slate-400"
              placeholder="Search for Services, Shops or Category..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
            />
            <Mic size={18} className="text-blue-500 mx-3 hidden sm:block" />
            
            <button 
              onClick={handleSearchTrigger}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Search size={20} />
              <span className="hidden lg:block font-black text-xs uppercase tracking-widest">Search</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}