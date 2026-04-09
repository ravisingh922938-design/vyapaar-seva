import React from 'react';

export function ImgCard({ title, url }: { title: string, url: string }) {
    return (
        <div className="cursor-pointer group">
            <div className="h-20 md:h-40 rounded-xl overflow-hidden mb-2 border-[1px] border-slate-100 group-hover:border-blue-500 transition-all shadow-sm">
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