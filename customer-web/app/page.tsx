"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Components
import JustdialHeader from './components/JustdialHeader';
import HeroBanners from './components/HeroBanners';
import SearchDiscovery from './components/SearchDiscovery';
import CuratedSections from './components/CuratedSections';
import MegaFooter from './components/MegaFooter';
import InquiryModal from './components/InquiryModal';

// Utils & Icons
import { getCategoryStyle } from '../utils/iconHelper';
import { ChevronRight, LayoutGrid, Loader2 } from 'lucide-react';

// ✅ टॉप १० कैटेगरी (ये हमेशा दिखेंगी, कोई लोडिंग टाइम नहीं)
const TOP_SERVICES = [
  { id: 't1', name: 'AC Repair' },
  { id: 't2', name: 'Doctor' },
  { id: 't3', name: 'Plumber' },
  { id: 't4', name: 'Electrician' },
  { id: 't5', name: 'Restaurant' },
  { id: 't6', name: 'Packers Movers' },
  { id: 't7', name: 'Car Repair' },
  { id: 't8', name: 'Lawyers' },
  { id: 't9', name: 'Real Estate' },
  { id: 't10', name: 'Hospitals' },
];

export default function FinalJustdialHome() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
 
  const API_BASE = "https://api.vister.in/api";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Backend Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedCats = (categories || []).filter((cat: any) =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-800">
      <JustdialHeader onSearch={(val) => setSearchTerm(val)} />
      <HeroBanners />

      {/* --- ✅ टॉप १० क्विक आइकॉन (पूरी तरह फ्रंटएंड आधारित) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-5 md:grid-cols-10 gap-3">
        {TOP_SERVICES.map((item) => {
          const style = getCategoryStyle(item.name);
          return (
            <div key={item.id} onClick={() => router.push(`/search-results?category=${item.name}`)} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-2xl flex items-center justify-center mb-1.5 border-[1px] border-slate-100 shadow-sm transition-all group-hover:scale-105`}>
                <div className={style.color}>{style.icon}</div>
              </div>
              <p className="text-[9px] font-[1000] text-slate-500 text-center uppercase leading-tight truncate w-full px-1">{item.name}</p>
            </div>
          );
        })}
      </div>

      <SearchDiscovery />
      <CuratedSections />

      {/* --- मेन सर्विस ग्रिड --- */}
      <main className="max-w-7xl mx-auto px-4 mt-12 mb-20">
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border-[1px] border-slate-200">
          <div className="flex justify-between items-center mb-10 px-2">
            <div className="flex items-center gap-2">
              <LayoutGrid size={24} className="text-blue-600" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {searchTerm ? `Searching: "${searchTerm}"` : "Browse All Services"}
              </h3>
            </div>
            <button onClick={() => router.push('/all-categories')} className="text-blue-600 font-bold text-xs flex items-center hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            {/* ✅ लोडिंग के समय धुंधले डिब्बे (Skeleton) दिखाना */}
            {isLoading ? (
              Array(16).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-14 h-14 bg-slate-200 rounded-full mb-2"></div>
                  <div className="w-12 h-2 bg-slate-100 rounded"></div>
                </div>
              ))
            ) : displayedCats.length > 0 ? (
              displayedCats.map((cat: any) => {
                const style = getCategoryStyle(cat.name);
                return (
                  <div key={cat._id} onClick={() => router.push(`/categories/${cat._id}`)} className="flex flex-col items-center p-3 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer group text-center">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-full flex items-center justify-center mb-2 mx-auto border border-white shadow-sm transition-transform group-hover:scale-110`}>
                      <div className={style.color}>{style.icon}</div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate w-full leading-tight">{cat.name}</p>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-10 font-bold text-slate-400">No Category Found</div>
            )}
          </div>
        </div>
      </main>

      <MegaFooter />
      <InquiryModal selectedCat={selectedCategory} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}