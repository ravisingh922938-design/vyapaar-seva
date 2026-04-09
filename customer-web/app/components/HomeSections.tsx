"use client";
import React from 'react';
import { Smartphone, Zap, Tv, Droplets, Plane, Car, LayoutGrid } from 'lucide-react';

export function HeroBanner() {
    return (
        <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-900 rounded-2xl h-36 md:h-64 flex items-center p-8 md:p-14 text-white relative overflow-hidden shadow-xl border-[1px] border-blue-400">
                <div className="z-10">
                    <h2 className="text-2xl md:text-5xl font-black mb-1 uppercase tracking-tighter italic">Sab Milega</h2>
                    <h2 className="text-lg md:text-4xl font-bold mb-4 italic opacity-90 underline decoration-yellow-400 text-white">In One Click!</h2>
                    <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-black text-[10px] shadow-lg hover:scale-105 transition-transform uppercase">Register Now</button>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 -skew-x-12 translate-x-10"></div>
            </div>
        </div>
    );
}

export function ImgCard({ title, url }: { title: string, url: string }) {
    return (
        <div className="cursor-pointer group">
            <div className="h-24 md:h-40 rounded-2xl overflow-hidden mb-2 border-[1px] border-slate-100 group-hover:border-blue-500 transition-all shadow-sm">
                <img src={url} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
            </div>
            <p className="text-[10px] font-black text-center text-slate-600 uppercase group-hover:text-blue-600 tracking-tighter">{title}</p>
        </div>
    );
}

export function IconBox({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group text-center">
            <div className={`w-10 h-10 md:w-11 md:h-11 border-[1px] border-slate-100 rounded-xl flex items-center justify-center text-blue-600 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm mx-auto`}>
                {icon}
            </div>
            <p className="text-[9px] font-bold text-slate-500 group-hover:text-slate-900 tracking-tighter uppercase">{title}</p>
        </div>
    );
}