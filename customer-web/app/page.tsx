"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Components Imports
import JustdialHeader from './components/JustdialHeader';
import HeroBanners from './components/HeroBanners';
import SearchDiscovery from './components/SearchDiscovery';
import CuratedSections from './components/CuratedSections';
import MegaFooter from './components/MegaFooter';
import InquiryModal from './components/InquiryModal';

// Icons & Logic
import { getCategoryStyle } from '../utils/iconHelper';
import { ChevronRight, LayoutGrid, Loader2 } from 'lucide-react';

export default function FinalJustdialHome() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // --- सबसे ज़रूरी: LOCALHOST इस्तेमाल करें ताकि Network Error न आए ---

  const API_BASE = "http://10.44.111.238:5000/api"; // Uncomment for production

  // 1. डेटाबेस से कैटेगरीज लोड करना
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Backend Not Connected:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. इंस्टेंट सर्च लॉजिक (बिना एरर के)
  const displayedCats = (categories || []).filter((cat: any) =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. 10 सेकंड का स्मार्ट ऑटो-पॉपअप
  useEffect(() => {
    const timer = setTimeout(() => {
      if (categories.length > 0 && !isModalOpen && searchTerm === "") {
        setSelectedCategory(categories[0]);
        setIsModalOpen(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [categories, isModalOpen, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-800">

      {/* --- Header (onSearch Prop के साथ) --- */}
      <JustdialHeader onSearch={(val) => setSearchTerm(val)} />

      <HeroBanners />

      {/* --- TOP 10 QUICK ICONS (Skeletons के साथ) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-5 md:grid-cols-10 gap-3 min-h-[80px]">
        {isLoading ? (
          Array(10).fill(0).map((_, i) => (
            <div key={i} className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse mx-auto"></div>
          ))
        ) : (
          categories.slice(0, 10).map((cat: any) => {
            const style = getCategoryStyle(cat.name);
            return (
              <div key={cat._id} onClick={() => router.push(`/categories/${cat._id}`)} className="flex flex-col items-center group cursor-pointer">
                <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-2xl flex items-center justify-center mb-1.5 border-[1px] border-slate-100 shadow-sm transition-all group-hover:scale-105`}>
                  <div className={style.color}>{style.icon}</div>
                </div>
                <p className="text-[9px] font-black text-slate-500 text-center uppercase leading-tight truncate w-full px-1">{cat.name}</p>
              </div>
            );
          })
        )}
      </div>

      <SearchDiscovery />
      <CuratedSections />

      {/* --- MAIN SERVICES GRID --- */}
      <main className="max-w-7xl mx-auto px-4 mt-12 mb-20">
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border-[1px] border-slate-200">
          <div className="flex justify-between items-center mb-10 px-2">
            <div className="flex items-center gap-2">
              <LayoutGrid size={24} className="text-blue-600" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {searchTerm ? `Searching: "${searchTerm}"` : "Browse All Services"}
              </h3>
            </div>
            {/* 404 से बचने के लिए इसे /all-categories पर भेजें (अगर पेज बना लिया है) */}
            <button onClick={() => router.push('/all-categories')} className="text-blue-600 font-bold text-xs flex items-center hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-bold text-slate-400 italic text-sm">Fetching Data from Server...</p>
              </div>
            ) : displayedCats.length > 0 ? (
              displayedCats.map((cat: any) => {
                const style = getCategoryStyle(cat.name);
                return (
                  <div key={cat._id} onClick={() => router.push(`/categories/${cat._id}`)} className="flex flex-col items-center p-3 rounded-2xl border border-transparent hover:border-blue-50 hover:bg-blue-50 transition-all cursor-pointer group text-center">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-full flex items-center justify-center mb-2 mx-auto border border-white shadow-sm transition-transform group-hover:scale-110`}>
                      <div className={style.color}>{style.icon}</div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 group-hover:text-blue-600 uppercase tracking-tighter truncate w-full leading-tight">
                      {cat.name}
                    </p>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400 font-bold italic">
                Category not found! Try searching something else.
              </div>
            )}
          </div>
        </div>
      </main>

      <MegaFooter />

      <InquiryModal
        selectedCat={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}