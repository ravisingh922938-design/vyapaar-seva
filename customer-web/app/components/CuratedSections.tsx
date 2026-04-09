"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function CuratedSections() {
    const router = useRouter();

    // डेटा को ग्रुप में बाँट दिया गया है
    const sections = [
        {
            category: "Wedding Requisites",
            items: [
                { name: "Banquet Halls", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200" },
                { name: "Bridal Requisite", img: "https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?q=80&w=200" },
                { name: "Caterers", img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=200" }
            ]
        },
        {
            category: "Beauty & Spa",
            items: [
                { name: "Beauty Parlours", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=200" },
                { name: "Spa & Massages", img: "https://images.unsplash.com/photo-1544161515-4af6b1d4640b?q=80&w=200" },
                { name: "Salons", img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=200" }
            ]
        },
        {
            category: "Repairs & Services",
            items: [
                { name: "AC Service", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=200" },
                { name: "Car Service", img: "https://images.unsplash.com/photo-1486006396193-471dff289c8d?q=80&w=200" },
                { name: "Bike Service", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200" }
            ]
        },
        {
            category: "Daily Needs",
            items: [
                { name: "Movies", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200" },
                { name: "Grocery", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200" },
                { name: "Electricians", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200" }
            ]
        }
    ];

    const handleItemClick = (name: string) => {
        router.push(`/search-results?q=${encodeURIComponent(name)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tighter italic">
                        {section.category}
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                        {section.items.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleItemClick(item.name)}
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                <div className="w-full aspect-square bg-slate-100 rounded-[1.5rem] overflow-hidden mb-3 border border-slate-50 transition-transform group-hover:scale-105 group-hover:shadow-lg">
                                    <img
                                        src={item.img}
                                        className="w-full h-full object-cover"
                                        alt={item.name}
                                    />
                                </div>
                                <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase text-center leading-tight group-hover:text-blue-600">
                                    {item.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}