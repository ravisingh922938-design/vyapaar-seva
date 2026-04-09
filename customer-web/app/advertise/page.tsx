"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    TrendingUp, Target, Users, CheckCircle, Zap,
    ArrowRight, MessageSquare, BarChart3, ShieldCheck, PhoneCall
} from 'lucide-react';
import JustdialHeader from '../components/JustdialHeader';
import MegaFooter from '../components/MegaFooter';

export default function AdvertisePage() {
    const router = useRouter();

    const plans = [
        {
            name: "Basic Growth",
            price: "₹499",
            duration: "Monthly",
            color: "border-slate-200",
            features: ["Verified Badge", "Listed in 1 Category", "Basic Analytics", "Email Support"]
        },
        {
            name: "Premium Leads",
            price: "₹1,499",
            duration: "Monthly",
            color: "border-blue-500 shadow-xl shadow-blue-50",
            popular: true,
            features: ["Top Rank in Search", "Unlimited Leads", "Featured Profile", "WhatsApp Alerts", "Dedicated Manager"]
        },
        {
            name: "Enterprise",
            price: "Custom",
            duration: "Yearly",
            color: "border-slate-800 bg-slate-900 text-white",
            features: ["Multi-City Reach", "API Integration", "Premium Brand Ads", "24/7 Priority Support"]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-800">
            <JustdialHeader onSearch={() => { }} />

            {/* --- 1. HERO SECTION --- */}
            <header className="bg-blue-600 py-16 md:py-24 px-6 text-center text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic animate-in fade-in slide-in-from-bottom duration-700">
                        Grow Your Business <br /> Across Patna
                    </h1>
                    <p className="mt-6 text-lg md:text-xl font-medium text-blue-100 max-w-2xl mx-auto">
                        Get discovered by thousands of customers every day. Vyapaar Seva helps local experts find real leads and build big brands.
                    </p>
                    <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
                        <button onClick={() => router.push('/free-listing')} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-50 transition-all">
                            Start Free Listing
                        </button>
                        <button className="bg-blue-500 text-white border border-blue-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-400">
                            View Ad Plans
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 2. WHY ADVERTISE? (Stats) --- */}
            <section className="max-w-7xl mx-auto px-6 -mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <Users className="text-blue-600" />, label: "Active Customers", val: "50,000+" },
                        { icon: <Target className="text-green-600" />, label: "Leads Generated", val: "10,000+" },
                        { icon: <TrendingUp className="text-orange-600" />, label: "Average Growth", val: "3.5x" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl">{stat.icon}</div>
                            <div>
                                <p className="text-2xl font-black text-slate-800">{stat.val}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 3. THE POWER OF ADVERTISING --- */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Why Choose Vyapaar Seva?</h2>
                    <p className="text-slate-400 font-medium mt-2">Hum Patna ke local experts ki asli takat hain.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Smart Targeting", desc: "Show your business to people searching in your area.", icon: <Target /> },
                        { title: "Verified Trust", desc: "Get our 'Verified' badge and win customer trust instantly.", icon: <ShieldCheck /> },
                        { title: "Instant Leads", desc: "Get customer enquiries directly on your phone via SMS.", icon: <Zap /> },
                        { title: "Business CRM", desc: "Manage all your customers and staff in one dashboard.", icon: <BarChart3 /> }
                    ].map((feature, i) => (
                        <div key={i} className="text-center p-6 hover:translate-y-[-5px] transition-all">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                {feature.icon}
                            </div>
                            <h4 className="font-black text-slate-800 uppercase text-sm mb-3">{feature.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 4. ADVERTISING PLANS --- */}
            <section className="bg-white py-24 px-6 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">Choose Your Ad Plan</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Transparent Pricing. No Hidden Fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, i) => (
                            <div key={i} className={`p-10 rounded-[3rem] border-2 relative flex flex-col ${plan.color}`}>
                                {plan.popular && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Most Popular</span>
                                )}
                                <h4 className="text-lg font-black uppercase italic mb-2">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                                    <span className="text-xs font-bold opacity-50 uppercase">/ {plan.duration}</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-medium">
                                            <CheckCircle size={18} className={plan.name === "Enterprise" ? "text-blue-400" : "text-green-500"} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${plan.name === "Enterprise" ? 'bg-white text-slate-900' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'}`}>
                                    Get Started Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 5. CONTACT FOR CUSTOM ADS --- */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <PhoneCall size={48} className="mx-auto mb-6 text-blue-400" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Need a Custom Plan?</h3>
                    <p className="mt-4 text-slate-400 font-medium">
                        If you have a big business and want a customized marketing strategy, our Patna agents will visit your shop personally.
                    </p>
                    <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
                        <a href="tel:+919229384100" className="bg-blue-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                            <ArrowRight size={16} /> Call 9229384100
                        </a>
                        <button className="bg-white/10 hover:bg-white/20 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                            Request Callback
                        </button>
                    </div>
                </div>
            </section>

            <MegaFooter />
        </div>
    );
}