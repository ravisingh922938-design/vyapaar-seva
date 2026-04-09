"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function HeroBanners() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    // 1. Main Slider का डेटा (फोटो के साथ)
    const slides = [
        {
            title: "Lowest Airfares",
            subtitle: "Time to fly at",
            img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=1000",
            bg: "bg-[#53b2fe]",
            query: "Travel Agents"
        },
        {
            title: "Summer Collection",
            subtitle: "Up to 50% Off on",
            img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000",
            bg: "bg-[#ff9a9e]",
            query: "Clothing Stores"
        },
        {
            title: "Expert Home Repairs",
            subtitle: "Get Trusted",
            img: "https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=1000",
            bg: "bg-[#a1c4fd]",
            query: "AC Repair"
        }
    ];

    // --- AUTO SLIDE LOGIC (हर 4 सेकंड में स्लाइड बदलेगा) ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const navigateTo = (query: string) => {
        router.push(`/search-results?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col md:flex-row gap-4 h-auto md:h-[400px]">

            {/* --- 1. MAIN AUTO-SLIDER (Left Side) --- */}
            <div className={`flex-[2.5] ${slides[currentSlide].bg} rounded-[2.5rem] relative overflow-hidden transition-all duration-700 shadow-lg`}>
                {/* Background Image with Overlay */}
                <img
                    src={slides[currentSlide].img}
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply animate-pulse"
                    alt="Slider"
                />

                <div className="relative z-10 p-10 md:p-16 flex flex-col h-full justify-center">
                    <p className="text-blue-900 font-bold text-lg mb-2">{slides[currentSlide].subtitle}</p>
                    <h2 className="text-4xl md:text-6xl font-black text-blue-900 leading-none tracking-tighter italic uppercase">
                        {slides[currentSlide].title}
                    </h2>

                    <button
                        onClick={() => navigateTo(slides[currentSlide].query)}
                        className="mt-8 bg-[#002f5b] text-white w-fit px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-transform"
                    >
                        Book Now
                    </button>

                    <div className="mt-auto pt-10">
                        <p className="text-[10px] font-bold text-blue-900/50 uppercase tracking-[0.3em]">Powered by VISTER TRAVEL</p>
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="absolute bottom-8 left-10 flex gap-2 z-20">
                    {slides.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-blue-900' : 'w-2 bg-blue-900/30'}`}></div>
                    ))}
                </div>
            </div>

            {/* --- 2. THE 4 VERTICAL CARDS (Right Side) --- */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-1 gap-3">

                {/* Card 1: B2B */}
                <div onClick={() => navigateTo('B2B')} className="bg-[#0076d7] rounded-[2rem] relative overflow-hidden p-6 text-white cursor-pointer group shadow-md">
                    <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=60&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase text-sm italic">B2B</h4>
                            <p className="text-[10px] font-bold opacity-80 uppercase">Quick Quotes</p>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/40"><ChevronRight size={16} /></div>
                    </div>
                </div>

                {/* Card 2: Repairs */}
                <div onClick={() => navigateTo('AC Repair')} className="bg-[#3e5ca9] rounded-[2rem] relative overflow-hidden p-6 text-white cursor-pointer group shadow-md">
                    <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=60&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase text-xs italic">Repairs & Services</h4>
                            <p className="text-[10px] font-bold opacity-80 uppercase">Nearest Vendor</p>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/40"><ChevronRight size={16} /></div>
                    </div>
                </div>

                {/* Card 3: Real Estate */}
                <div onClick={() => navigateTo('Real Estate')} className="bg-[#7b61ff] rounded-[2rem] relative overflow-hidden p-6 text-white cursor-pointer group shadow-md">
                    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=60&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase text-sm italic">Real Estate</h4>
                            <p className="text-[10px] font-bold opacity-80 uppercase">Finest Agents</p>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/40"><ChevronRight size={16} /></div>
                    </div>
                </div>

                {/* Card 4: Doctors */}
                <div onClick={() => navigateTo('Doctors')} className="bg-[#00a651] rounded-[2rem] relative overflow-hidden p-6 text-white cursor-pointer group shadow-md">
                    <img src="https://images.unsplash.com/photo-1505751172107-573967a46512?auto=format&fit=crop&q=60&w=400" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h4 className="font-black uppercase text-sm italic">Doctors</h4>
                            <p className="text-[10px] font-bold opacity-80 uppercase">Book Now</p>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/40"><ChevronRight size={16} /></div>
                    </div>
                </div>

            </div>
        </div>
    );
}