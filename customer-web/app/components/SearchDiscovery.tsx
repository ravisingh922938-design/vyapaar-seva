"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; // राउटर इम्पोर्ट किया
import { ChevronRight } from 'lucide-react';

export default function SearchDiscovery() {
    const router = useRouter();

    // क्लिक करने पर सर्च रिजल्ट्स पर ले जाने वाला फंक्शन
    const handleNav = (query: string) => {
        router.push(`/search-results?q=${encodeURIComponent(query)}`);
    };

    const popularSearches = [
        { title: "Banquet Halls", btn: "Enquire Now", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400" },
        { title: "Interior Designers", btn: "Enquire Now", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400" },
        { title: "Home Tutors", btn: "Enquire Now", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400" },
        { title: "Car Rental", btn: "Explore", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400" },
        { title: "Orthopaedic", btn: "Explore", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400" },
    ];

    const seasonalItems = [
        { title: "AC Dealers", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200" },
        { title: "Water Suppliers", img: "https://images.unsplash.com/photo-1516646255117-f9f933680173?w=200" },
        { title: "Air Cooler", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200" },
        { title: "Refrigerators", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 space-y-12">

            {/* --- 1. POPULAR SEARCHES (Blue Big Cards) --- */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Popular Searches</h3>
                    <div className="bg-white border rounded-full p-1 shadow-sm cursor-pointer hover:bg-slate-50">
                        <ChevronRight size={20} className="text-slate-400" />
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {popularSearches.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => handleNav(item.title)} // कार्ड पर क्लिक करने पर पेज खुलेगा
                            className="min-w-[200px] md:min-w-[240px] bg-[#0076D7] rounded-2xl overflow-hidden shadow-md group cursor-pointer border-[1px] border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95"
                        >
                            <div className="h-32 md:h-40 overflow-hidden">
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={item.title} />
                            </div>
                            <div className="p-4">
                                <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-tighter italic">{item.title}</h4>
                                <button className="bg-white text-[#0076D7] px-4 py-1.5 rounded-lg font-black text-[10px] uppercase hover:bg-blue-50 transition-colors">
                                    {item.btn}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 2. SEASONAL ESSENTIALS (White List Section) --- */}
            <section className="bg-white border-[1px] border-slate-200 rounded-[2rem] p-6 md:p-10 shadow-sm">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">Sunny Day Essentials</h3>
                        <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Seasonal</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Discover wide range of Patna's summer collection</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {seasonalItems.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => handleNav(item.title)} // क्लिक करने पर सर्च पेज खुलेगा
                            className="flex items-center border-[1px] border-slate-100 rounded-2xl overflow-hidden hover:border-blue-400 hover:bg-slate-50 transition-all cursor-pointer shadow-sm group p-1 active:scale-95"
                        >
                            <div className="w-24 h-20 bg-gray-50 rounded-xl overflow-hidden">
                                <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                            </div>
                            <div className="px-4">
                                <h5 className="font-black text-xs text-slate-700 mb-1 uppercase tracking-tight">{item.title}</h5>
                                <p className="text-blue-600 font-bold text-[9px] uppercase flex items-center gap-1">Explore Now <ChevronRight size={10} /></p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}