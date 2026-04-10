"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function AddReview() {
    const params = useParams();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const API_BASE = "http://api.vister.in/api"; // Always use localhost for testing

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (rating === 0) return alert("Kripya star rating chunein!");

        setLoading(true);
        try {
            await axios.post(`${API_BASE}/vendors/reviews/add`, {
                vendorId: params.id,
                customerName: name,
                rating,
                comment
            });
            setSubmitted(true);
            setTimeout(() => router.back(), 2000);
        } catch (err) {
            alert("Review save nahi ho paya. Backend chal raha hai?");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle size={80} className="text-green-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Dhanyawad!</h2>
                <p className="text-slate-500 mt-2 font-medium">Aapka feedback Patna ke doosre grahako ki madad karega.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-blue-600 transition-colors">
                <ArrowLeft size={16} /> Wapas Jayein
            </button>

            <div className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100">
                <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter italic">Write a Review</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">Rate your experience with this expert</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* STAR RATING PICKER */}
                    <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-all hover:scale-125 active:scale-90"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    size={44}
                                    fill={(hover || rating) >= star ? "#EAB308" : "none"}
                                    className={(hover || rating) >= star ? "text-yellow-500" : "text-slate-200"}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Aapka Naam</label>
                            <input
                                required
                                placeholder="E.g. Sumit Kumar"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-700"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Aapka Anubhav</label>
                            <textarea
                                required
                                placeholder="Inhone kaisa kaam kiya? (Price, Quality, Behaviour)"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 h-32 font-medium text-slate-600 resize-none"
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-[1000] py-5 rounded-[2rem] shadow-xl shadow-blue-100 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : "Submit My Review"}
                    </button>
                </form>
            </div>
        </div>
    );
}