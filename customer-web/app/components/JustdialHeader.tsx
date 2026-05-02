"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Mic, Menu, User, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

    export default function JustdialHeader({ onSearch }: any) { 
  const [location, setLocation] = useState("Detecting Location...");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // ✅ 1. LIVE LOCATION FETCH KARNE KA LOGIC
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // OpenStreetMap ki free API use karke City ka naam nikal rahe hain
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address.city || data.address.suburb || data.address.state || "Patna";
          setLocation(city);
        } catch (error) {
          setLocation("Patna, Bihar"); // Fallback
        }
      }, () => {
        setLocation("Patna, Bihar"); // Permission deny hone par
      });
    }
  }, []);

  const handleSearchTrigger = () => {
    if (searchValue.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchValue)}`);
      if (onSearch) onSearch(searchValue);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-[100] py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Row: Logo and Login */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
             <Menu className="md:hidden text-slate-600" size={24} />
             <h1 onClick={() => router.push('/')} className="text-2xl font-[1000] text-blue-600 cursor-pointer italic tracking-tighter uppercase">VYAPAAR SEVA</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600">Advertise</button>
             <button onClick={() => router.push('/free-listing')} className="hidden md:block text-[10px] font-black text-white bg-blue-600 px-4 py-2 rounded-full uppercase shadow-lg shadow-blue-100">Free Listing</button>
             <button className="bg-blue-50 text-blue-600 p-2 rounded-full md:px-6 md:py-2 md:rounded-xl flex items-center gap-2">
                <User size={18} />
                <span className="hidden md:block font-black text-xs uppercase">Login / Sign Up</span>
             </button>
          </div>
        </div>

        {/* ✅ 2. RESPONSIVE SEARCH BAR (Mobile par stack ho jayega) */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          
          {/* Location Box */}
          <div className="w-full md:w-1/3 flex items-center bg-slate-100 p-3 rounded-2xl md:rounded-l-2xl md:rounded-r-none border border-slate-200">
            <MapPin size={18} className="text-blue-600 mr-2 shrink-0" />
            <span className="text-xs font-bold text-slate-700 truncate flex-1">{location}</span>
            <Navigation size={14} className="text-slate-400 ml-2 animate-pulse" />
          </div>

          {/* Search Input Box */}
          <div className="w-full md:flex-1 flex items-center bg-white border-2 border-slate-200 p-1 rounded-2xl md:rounded-none md:border-l-0">
            <input 
              className="flex-1 p-2 text-sm font-bold outline-none text-slate-800 placeholder:text-slate-400"
              placeholder="Search for Services (e.g. AC, Plumber)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
            />
            <Mic size={18} className="text-blue-500 mx-2 hidden sm:block" />
            
            {/* Desktop Search Button */}
            <button 
              onClick={handleSearchTrigger}
              className="bg-orange-500 text-white p-3 rounded-xl hidden md:block hover:bg-orange-600 transition-all"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Search Button (Only visible on small screens) */}
          <button 
            onClick={handleSearchTrigger}
            className="w-full md:hidden bg-orange-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Search size={20} />
            <span className="font-black text-sm uppercase">Search Now</span>
          </button>

        </div>
      </div>
    </header>
  );
}