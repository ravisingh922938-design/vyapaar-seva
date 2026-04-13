"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Smartphone, Mail, Lock, MapPin, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import JustdialHeader from '../components/JustdialHeader';

export default function HiringPage() {
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', area: 'Patna' });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const router = useRouter();

    const handleJoin = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://api.vister.in/api/vendors/salesman/join", formData);
            if (res.data.status === "success") setDone(true);
        } catch (err: any) {
            alert(err.response?.data?.message || "Kuch galti hui!");
        } finally { setLoading(false); }
    };

    if (done) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
                <h1 className="text-3xl font-black text-slate-800">Welcome to Vyapaar Seva Team!</h1>
                <p className="text-slate-500 mt-2 max-w-sm">Aapka registration ho gaya hai. Ab aap Salesman App me apne email aur password se login kar sakte hain.</p>
                <button onClick={() => router.push('/')} className="mt-10 bg-blue-600 text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest">Back to Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-sans">
            <JustdialHeader onSearch={() => { }} />
            <div className="max-w-xl mx-auto py-16 px-6">
                <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100">
                    <div className="text-center mb-10">
                        <div className="bg-blue-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="text-blue-600" size={30} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 uppercase italic">Join as Sales Partner</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Earn ₹100 on every shop recharge</p>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="relative">
                            <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <User className="absolute right-4 top-4 text-slate-300" size={18} />
                        </div>
                        <div className="relative">
                            <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            <Smartphone className="absolute right-4 top-4 text-slate-300" size={18} />
                        </div>
                        <div className="relative">
                            <input required type="email" placeholder="Email (Login ID)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <Mail className="absolute right-4 top-4 text-slate-300" size={18} />
                        </div>
                        <div className="relative">
                            <input required type="password" placeholder="Create Password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <Lock className="absolute right-4 top-4 text-slate-300" size={18} />
                        </div>
                        <div className="relative">
                            <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold text-slate-600 outline-none appearance-none" onChange={(e) => setFormData({ ...formData, area: e.target.value })}>
                                <option value="Patna">Working Area: Patna</option>
                                <option value="Gaya">Gaya</option>
                                <option value="Muzaffarpur">Muzaffarpur</option>
                            </select>
                            <MapPin className="absolute right-4 top-4 text-slate-300" size={18} />
                        </div>

                        <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-[1000] uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit Application"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}