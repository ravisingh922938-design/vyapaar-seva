"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
    const [vendors, setVendors] = useState([]);
    const [allLeads, setAllLeads] = useState([]);
    const [amount, setAmount] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const API_BASE = "http://localhost:5000/api/api";

    // 1. Data Fetch Karne ka function
    const fetchData = async () => {
        try {
            const vendorRes = await axios.get(`${API_BASE}/vendors`);
            const leadRes = await axios.get(`${API_BASE}/leads`);
            setVendors(vendorRes.data);
            setAllLeads(leadRes.data);
        } catch (err) {
            console.log("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Recharge Handle karna
    const handleRecharge = async (id: string) => {
        const rechargeAmount = amount[id];
        if (!rechargeAmount || rechargeAmount <= 0) {
            alert("Sahi amount daliye!");
            return;
        }

        try {
            await axios.put(`${API_BASE}/vendors/recharge/${id}`, { amount: Number(rechargeAmount) });
            alert("✅ Recharge Successful!");
            fetchData(); // Data refresh karein
        } catch (err) {
            alert("Error recharging!");
        }
    };

    if (loading) return <div className="bg-gray-900 min-h-screen text-white p-10">Loading Control Room...</div>;

    return (
        <div className="p-10 bg-gray-950 min-h-screen text-white font-sans">
            <h1 className="text-4xl font-black mb-10 text-orange-500 tracking-tighter border-b-4 border-orange-500 inline-block">
                VISTER - CONTROL ROOM (PATNA)
            </h1>

            {/* --- VENDOR RECHARGE SECTION --- */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                    <span className="mr-2">💳</span> VENDOR WALLET MANAGEMENT
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((v: any) => (
                        <div key={v._id} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 shadow-xl">
                            <div className="mb-4">
                                <p className="text-xl font-extrabold text-white">{v.name}</p>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">{v.shopName}</p>
                                <p className="text-gray-500 text-xs">Area: {v.area}</p>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-2xl mb-4 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Balance</span>
                                <span className="text-green-400 font-black text-2xl">₹{v.walletBalance}</span>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Amt"
                                    className="flex-1 p-3 rounded-xl bg-gray-950 text-white border border-gray-700 outline-none focus:border-orange-500"
                                    onChange={(e) => setAmount({ ...amount, [v._id]: Number(e.target.value) })}
                                />
                                <button
                                    onClick={() => handleRecharge(v._id)}
                                    className="bg-orange-600 px-4 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95"
                                >
                                    ADD CASH
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- LIVE LEAD MONITOR SECTION --- */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                    <span className="mr-2">🔥</span> PATNA LIVE INQUIRIES (LEADS)
                </h2>
                <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-gray-400 uppercase text-xs tracking-widest">
                                <th className="p-5">Customer Name</th>
                                <th className="p-5">Service / Category</th>
                                <th className="p-5">Area</th>
                                <th className="p-5">Mobile</th>
                                <th className="p-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {allLeads.map((lead: any) => (
                                <tr key={lead._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-5 font-bold text-white">{lead.customerName}</td>
                                    <td className="p-5 text-blue-300">{lead.category?.name || "Service"}</td>
                                    <td className="p-5 text-gray-400">{lead.area}</td>
                                    <td className="p-5 font-mono text-gray-500">XXXXXX{lead.customerPhone?.slice(-4)}</td>
                                    <td className="p-5">
                                        <span className={`px-4 py-1 rounded-full font-bold text-xs ${lead.unlockedBy.length > 0
                                            ? "bg-green-900/30 text-green-400 border border-green-800"
                                            : "bg-orange-900/30 text-orange-400 border border-orange-800"
                                            }`}>
                                            {lead.unlockedBy.length > 0 ? `SOLD (${lead.unlockedBy.length})` : "WAITING"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {allLeads.length === 0 && (
                        <div className="p-10 text-center text-gray-500">No leads found in Patna yet.</div>
                    )}
                </div>
            </section>
        </div>
    );
}