"use client";
import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock } from 'lucide-react';

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION */}
            <div className="bg-blue-600 py-16 px-6 text-center text-white">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Contact Vister Team</h1>
                <p className="text-xl opacity-90">Hum Patna ke har business ko digital banane ke liye taiyar hain.</p>
            </div>

            <main className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-16">

                {/* LEFT: CONTACT INFO */}
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-8">Get In Touch</h2>
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Phone size={24} /></div>
                            <div>
                                <p className="font-bold text-slate-500 uppercase text-xs">Phone</p>
                                <p className="text-xl font-bold text-slate-800">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-2xl text-green-600"><MessageCircle size={24} /></div>
                            <div>
                                <p className="font-bold text-slate-500 uppercase text-xs">WhatsApp Support</p>
                                <p className="text-xl font-bold text-slate-800">Chat with Experts</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><MapPin size={24} /></div>
                            <div>
                                <p className="font-bold text-slate-500 uppercase text-xs">Office Address</p>
                                <p className="text-lg text-slate-700">Boring Road Chauraha, Patna, Bihar - 800001</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><Clock size={24} /></div>
                            <div>
                                <p className="font-bold text-slate-500 uppercase text-xs">Working Hours</p>
                                <p className="text-lg text-slate-700">Mon - Sat (10:00 AM - 7:00 PM)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: CONTACT FORM */}
                <div className="bg-slate-50 p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Bhejiye Apni Query</h3>
                    <form className="space-y-4">
                        <input placeholder="Aapka Naam" className="w-full p-4 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                        <input placeholder="Email ya Mobile" className="w-full p-4 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                        <textarea placeholder="Hum aapki kya madad kar sakte hain?" className="w-full p-4 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-32"></textarea>
                        <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase">
                            Send Message
                        </button>
                    </form>
                </div>

            </main>

            <footer className="bg-slate-900 py-10 text-center text-slate-500 text-xs">
                VISTER TECHNOLOGIES © 2026 - PATNA, BIHAR
            </footer>
        </div>
    );
}