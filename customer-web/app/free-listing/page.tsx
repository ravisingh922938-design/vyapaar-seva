"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Camera, Globe, MapPin, Hash, CheckCircle, ArrowRight, Loader2, Search } from 'lucide-react';

// ✅ १. मंतु भाई, ये रही आपकी पूरी ११५ कैटेगरी की मेगा लिस्ट (Alphabetical Order में)
const MEGA_CATEGORIES_LIST = [
    "Abacus Classes", "AC Repair & Service", "Advertising Agencies", "Ambulance Services", "Architects", "Astrologers", "Auto Spare Parts", "Ayurvedic Doctors", "Bakeries", "Bank/SSC Coaching", "Banquet Halls", "Battery Dealers", "Beauty Parlours", "Bike Dealers", "Bike Repair Centers", "Blood Banks", "Bookings", "Builders & Developers", "CA / Tax Consultants", "Car Accessories", "Car Dealers", "Car Repair & Services", "Car Wash Centers", "Cardiologists", "Carpenters", "Caterers", "CCTV Installation", "Chartered Accountants", "Civil Contractors", "Cleaning Services", "Clinics", "Clothing Stores", "Colleges", "Computer Training", "Computer/Laptop Repair", "Construction Material", "Courier Services", "Dance Classes", "Decorators", "Dentists", "Dermatologists", "Diagnostic Centers", "Digital Marketing", "Doctors", "Drawing Classes", "Driving Schools", "Dry Cleaners", "Education", "Electricians", "Electronic Goods", "Engineering Colleges", "Event Managers", "Fashion Designers", "Florists", "Footwear Shops", "Furniture Dealers", "Gardeners", "Gents Salons", "Gift Shops", "Graphic Designers", "Gyms", "Hardware Shops", "Home Cleaning", "Home Tutors", "Homeopathic Doctors", "Hospitals", "Hostels", "Hotel", "IAS/UPSC Coaching", "IIT/JEE Coaching", "Insurance Agents", "Interior Designers", "Inverter Dealers", "IT Companies", "Jewellery Showrooms", "Kitchenware Shops", "Lawyers & Advocates", "Library", "Makeup Artists", "Manpower Agencies", "Medical Colleges", "Mobile Phone Shops", "Music Classes", "Nursing Homes", "Opticians", "Packers & Movers", "Painting Contractors", "Pathology Labs", "Pest Control Services", "Pet Shops", "Pharmacies/Chemists", "Photographers", "Physiotherapists", "Play Schools", "Plumbers", "Printing Services", "Property Evaluators", "Psychiatrists", "Real Estate Agents", "Refrigerator Repair", "Restaurants", "RO Water Purifier", "Sanitaryware Dealers", "Schools (CBSE/ICSE)", "Security Guards Services", "Solar Panel Dealers", "Spoken English Classes", "Sports Goods", "Stationery Shops", "Supermarkets", "Tailors", "Tent House", "Tile Dealers", "Towing Services", "Toy Stores", "Tyre Dealers", "Used Car Dealers", "Vastu Consultants", "Veterinary Doctors", "Video Editors", "Washing Machine Repair", "Water Tank Cleaning", "Water Tankers", "Web Designers", "Wedding Planners", "Yoga Therapy Centers"
].sort().map((name, index) => ({ _id: `temp_${index}`, name })); // ID जनरेट की गई है

export default function FreeListingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>(MEGA_CATEGORIES_LIST);
    const [searchTerm, setSearchTerm] = useState(""); // लिस्ट में ढूंढने के लिए
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', password: '', shopName: '',
        category: '', categoryName: '', city: '', state: '', area: '', pincode: '',
        fullAddress: '', description: '', image: null as File | null
    });

    const router = useRouter();
    const API_BASE = "https://api.vister.in/api";

    // लाइव डेटा सिंक (अगर बैकएंड से ११५ से अलग नाम आते हैं)
    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    // मोंगोडीबी की असली ID वाला डेटा सेट करें
                    setCategories(res.data);
                }
            })
            .catch(() => console.log("Using Safety Mega List"));
    }, []);

    // सर्च फिल्टर लॉजिक
    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNextStep = (e: any) => {
        e.preventDefault();
        if (!formData.category) return alert("Pehle List se Category select karein!");
        if (!formData.pincode || formData.pincode.length !== 6) return alert("6-digit Pincode bharna zaroori hai!");
        setStep(2);
    };

    const handleFinalSubmit = async () => {
        if (!formData.image) return alert("Dukan ki photo zaroori hai!");
        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'image') data.append(key, value as string);
            });
            if (formData.image) data.append('image', formData.image);

            await axios.post(`${API_BASE}/vendors/register`, data);
            setStep(3);
        } catch (err) {
            alert("Registration Error! Email/Phone pehle se ho sakta hai.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center p-4 md:p-8 font-sans">
            
            <div className="max-w-5xl w-full text-center mb-6">
                <h1 className="text-3xl font-[1000] text-blue-600 italic uppercase flex items-center justify-center gap-2">
                   <Globe size={30} className="animate-spin-slow"/> VYAPAAR SEVA
                </h1>
                <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] mt-1">ALL INDIA BUSINESS DIRECTORY</p>
            </div>

            <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white">
                
                {/* --- बायाँ भाग: ११५+ नाम वाली स्क्रॉल लिस्ट --- */}
                {step === 1 && (
                    <div className="w-full md:w-1/3 bg-slate-50 border-r flex flex-col">
                        <div className="p-4 border-b bg-white">
                            <h2 className="text-[10px] font-black uppercase text-slate-400 mb-2">1. Select Category</h2>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                                <input 
                                    className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 ring-blue-100"
                                    placeholder="Search 115+ categories..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[550px] p-2 space-y-1">
                            {filteredCategories.map((cat: any) => (
                                <div 
                                    key={cat._id} 
                                    onClick={() => setFormData({...formData, category: cat._id, categoryName: cat.name})}
                                    className={`p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center
                                    ${formData.category === cat._id 
                                        ? 'bg-blue-600 text-white shadow-lg translate-x-1' 
                                        : 'bg-white hover:bg-blue-50 text-slate-600 border border-slate-100'}`}
                                >
                                    <span className="text-[11px] font-black uppercase">{cat.name}</span>
                                    {formData.category === cat._id && <CheckCircle size={14} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- दायाँ भाग: फॉर्म डिटेल्स --- */}
                <div className="flex-1 p-6 md:p-10">
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                <h2 className="text-xl font-black text-slate-800">Business Registration</h2>
                                {formData.categoryName && <div className="bg-green-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-md">✓ {formData.categoryName}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required placeholder="Dukan / Business Name" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none focus:border-blue-500" value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} />
                                <input required placeholder="Owner Name" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="email" placeholder="Login Email" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <input required type="password" placeholder="Create Password" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="tel" maxLength={10} placeholder="10 Digit Mobile" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <input required placeholder="Area / Locality" className="p-4 bg-slate-50 border rounded-2xl font-bold outline-none" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <input required type="number" placeholder="Pincode" className="w-full p-4 pl-10 bg-blue-50 border border-blue-100 rounded-2xl font-bold outline-none" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                    <Hash size={16} className="absolute left-4 top-5 text-blue-400" />
                                </div>
                                <input required placeholder="City" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                <input required placeholder="State" className="p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-[1000] uppercase shadow-xl mt-4 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                Next Step: Photo <ArrowRight size={20} />
                            </button>
                        </form>
                    )}

                    {/* Step 2: Photo Upload */}
                    {step === 2 && (
                        <div className="text-center space-y-8 max-w-md mx-auto">
                            <h2 className="text-2xl font-black italic uppercase underline decoration-blue-500 underline-offset-8">Upload Shop Photo</h2>
                            <label className="cursor-pointer block h-72 bg-slate-50 border-4 border-dashed rounded-[3rem] overflow-hidden hover:border-blue-400 transition-all shadow-inner">
                                <input type="file" accept="image/*" hidden onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    if (file) { setFormData({ ...formData, image: file }); setImagePreview(URL.createObjectURL(file)); }
                                }} />
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full"><Camera size={60} className="text-slate-200"/><p className="text-xs font-black text-slate-400 mt-2 uppercase">Click to Select Shop Image</p></div>}
                            </label>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest">Back</button>
                                <button onClick={handleFinalSubmit} disabled={loading} className="flex-[2] bg-green-600 text-white py-4 rounded-full font-black shadow-lg hover:bg-green-700">
                                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "COMPLETE LISTING"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-20 text-center space-y-6">
                            <CheckCircle size={110} className="text-green-500 mx-auto animate-bounce" />
                            <h2 className="text-4xl font-black italic text-slate-800 uppercase">Mubarak Ho!</h2>
                            <p className="text-slate-500 font-bold px-6 uppercase text-xs tracking-widest">Aapki dukan "Vyapaar Seva" par register ho gayi hai.</p>
                            <button onClick={() => router.push('/')} className="bg-slate-900 text-white px-12 py-5 rounded-full font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all">Back to Home</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}