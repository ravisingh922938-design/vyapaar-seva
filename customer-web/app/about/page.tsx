"use client";
import React from 'react';
import { Target, Users, Rocket, ShieldCheck, Heart } from 'lucide-react';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION */}
            <section className="bg-slate-900 py-24 px-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
                        Patna's Digital <span className="text-blue-500">Revolution</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
                        Hum Vyapaar Seva ke zariye Bihar ke har chhote-bade dukaandaar ko duniya se jodh rahe hain.
                    </p>
                </div>
            </section>

            {/* 2. OUR VISION & MISSION */}
            <main className="max-w-6xl mx-auto py-20 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-800 mb-6 border-l-8 border-blue-600 pl-4">Humara Maqsad</h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            Vister Technologies ki shuruat Patna mein hui thi ek simple soch ke saath—ki Bihar ke businessmen ko Justdial ya Google ke bharose nahi rehna chahiye. Humein chahiye apna system, apni seva.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            2026 tak humara target hai Patna ke 10,000+ dukaandaron ko digital platform par laana aur unki kamayi ko 3 guna badhana.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-8 rounded-3xl text-center">
                            <TextIcon icon={<Target className="mx-auto mb-2 text-blue-600" />} title="Focus" desc="Local Business First" />
                        </div>
                        <div className="bg-orange-50 p-8 rounded-3xl text-center">
                            <TextIcon icon={<ShieldCheck className="mx-auto mb-2 text-orange-600" />} title="Trust" desc="100% Verified" />
                        </div>
                        <div className="bg-green-50 p-8 rounded-3xl text-center">
                            <TextIcon icon={<Rocket className="mx-auto mb-2 text-green-600" />} title="Growth" desc="Faster Leads" />
                        </div>
                        <div className="bg-purple-50 p-8 rounded-3xl text-center">
                            <TextIcon icon={<Heart className="mx-auto mb-2 text-purple-600" />} title="Love" desc="Made in Patna" />
                        </div>
                    </div>
                </div>

                {/* 3. WHY VISTER? */}
                <div className="bg-slate-50 rounded-[3rem] p-12 md:p-20">
                    <h2 className="text-3xl font-black text-center text-slate-800 mb-12 uppercase tracking-widest">Why Choose Vyapaar Seva?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard title="Transparent Pricing" desc="Koi chhupa hua kharcha nahi. Sirf ₹20 mein asli grahak ka number." />
                        <FeatureCard title="Smart Analytics" desc="Apne dhandhe ka live hisaab-kitab dekhein mobile app par." />
                        <FeatureCard title="Patna Support" desc="Hum Patna mein hain! Kabhi bhi dukan par aakar madad le sakte hain." />
                    </div>
                </div>
            </main>

            {/* 4. CALL TO ACTION */}
            <section className="bg-blue-600 py-20 text-center text-white">
                <h3 className="text-3xl font-bold mb-6">Chaliye Patna ko milkar Digital banate hain!</h3>
                <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform">
                    JOIN AS A PARTNER
                </button>
            </section>
        </div>
    );
}

// Helper Components
function TextIcon({ icon, title, desc }: any) {
    return (
        <>
            {icon}
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-slate-500">{desc}</p>
        </>
    )
}

function FeatureCard({ title, desc }: any) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold text-blue-600 mb-3">{title}</h4>
            <p className="text-slate-500 leading-relaxed">{desc}</p>
        </div>
    )
}