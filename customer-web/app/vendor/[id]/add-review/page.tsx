"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AddReview() {
    const params = useParams();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (rating === 0) return alert("Kripya star rating chunein!");

        try {
            await axios.post('http://10.243.86.238:5000/api/vendors/reviews/add', {
                vendorId: params.id,
                customerName: name,
                rating,
                comment
            });
            setSubmitted(true);
            setTimeout(() => router.back(), 2000);
        } catch (err) {
            alert("Review save nahi ho paya.");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle size={80} className="text-green-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-black text-slate-800">Dhanyawad!</h2>
                <p className="text-slate-500 mt-2">Aapka feedback Patna ke doosre grahako ki madad karega.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold mb-8">
                <ArrowLeft size={20} /> Wapas Jayein
            </button>

            <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10">
                <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Write a Review</h1>
                <p className="text-slate-500 mb-8">Aapka anubhav kaisa raha? Sitare (Stars) dekar batayein.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* STAR RATING PICKER */}
                    <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="transition-transform active:scale-125"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star
                                    size={48}
                                    fill={(hover || rating) >= star ? "#EAB308" : "none"}
                                    className={(hover || rating) >= star ? "text-yellow-500" : "text-slate-300"}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-2">Aapka Naam</label>
                        <input
                            required
                            placeholder="E.g. Sumit Kumar"
                            className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-2">Review (Kaisa kaam kiya?)</label>
                        <textarea
                            placeholder="Inhone mera AC bohot jaldi aur kam daam mein theek kar diya..."
                            className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 h-32"
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg uppercase">
                        Submit My Review
                    </button>
                </form>
            </div>
        </div>
    );
}
<div className="flex justify-between items-center mb-8">
    <h3 className="text-2xl font-black text-slate-800">Verified Reviews</h3>
    <button
        onClick={() => router.push(`/vendor/${vendor._id}/add-review`)}
        className="bg-blue-50 text-blue-600 font-bold px-6 py-2 rounded-full border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
    >
        + Add Your Review
    </button>
</div>