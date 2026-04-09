import React from 'react';
import { Heart, GraduationCap, Zap, Briefcase, ChevronRight, LayoutGrid } from 'lucide-react';

export default function CategoryGrid({ categories, router }: any) {
    // Icon aur Style chunne ka logic
    const getStyle = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('doctor') || n.includes('hospital')) return { icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' };
        if (n.includes('school') || n.includes('college')) return { icon: <GraduationCap size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' };
        if (n.includes('ac') || n.includes('electric')) return { icon: <Zap size={20} />, color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { icon: <Briefcase size={20} />, color: 'text-gray-400', bg: 'bg-gray-50' };
    };

    return (
        <section className="max-w-7xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8 px-2">
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">Popular Services</h3>
                <button
                    onClick={() => router.push('/categories')}
                    className="text-blue-600 font-bold text-xs flex items-center hover:underline"
                >
                    View All <ChevronRight size={14} />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
                {categories.map((cat: any) => {
                    const st = getStyle(cat.name);
                    return (
                        <div
                            key={cat._id}
                            onClick={() => router.push(`/search/${cat._id}`)}
                            className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-blue-300 transition-all text-center group"
                        >
                            <div className={`w-10 h-10 ${st.bg} rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                <div className={st.color}>{st.icon}</div>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">
                                {cat.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}