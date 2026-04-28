"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Components
import JustdialHeader from './components/JustdialHeader';
import HeroBanners from './components/HeroBanners';
import SearchDiscovery from './components/SearchDiscovery';
import CuratedSections from './components/CuratedSections';
import MegaFooter from './components/MegaFooter';
import InquiryModal from './components/InquiryModal';

// Utils & Icons
import { getCategoryStyle } from '../utils/iconHelper';
import { ChevronRight, LayoutGrid, Loader2 } from 'lucide-react';

// ✅ १. मंतु भाई, ये है वो ११० कैटेगरी की लिस्ट (बैकअप)। 
// अगर बैकएंड बंद भी हो जाए, तो ये वेबसाइट को खाली नहीं होने देंगी।
const BACKUP_CATEGORIES = [
  { _id: 'b1', name: 'AC Repair' }, { _id: 'b2', name: 'Doctor' }, { _id: 'b3', name: 'Plumber' },
  { _id: 'b4', name: 'Electrician' }, { _id: 'b5', name: 'Restaurant' }, { _id: 'b6', name: 'Packers Movers' },
  { _id: 'b7', name: 'Car Repair' }, { _id: 'b8', name: 'Lawyers' }, { _id: 'b9', name: 'Real Estate' },
  { _id: 'b10', name: 'Hospitals' }, { _id: 'b11', name: 'Dentists' }, { _id: 'b12', name: 'Graphic Designers' },
  { _id: 'b13', name: 'Gym' }, { _id: 'b14', name: 'Schools' }, { _id: 'b15', name: 'CCTV' },
  { _id: 'b16', name: 'Yoga' }, { _id: 'b17', name: 'Beauty Parlour' }, { _id: 'b18', name: 'Jewellery' },
  { _id: 'b19', name: 'Bakery' }, { _id: 'b20', name: 'Car Wash' }, { _id: 'b21', name: 'Photographers' },
  // ... बाकी ११० नाम भी इसी तरह बैकअप में रहेंगे
   { _id: 'm22', name: 'Hospitals' }, { _id: 'm23', name: 'Nursing Homes' }, { _id: 'm24', name: 'Clinics' },
  { _id: 'm25', name: 'Pathology Labs' }, { _id: 'm26', name: 'Diagnostic Centers' }, { _id: 'm27', name: 'Physiotherapists' },
  { _id: 'm28', name: 'Ambulance Services' }, { _id: 'm29', name: 'Blood Banks' }, { _id: 'm30', name: 'Pharmacies' },

  // 3. Education
  { _id: 'm31', name: 'Schools' }, { _id: 'm32', name: 'Colleges' }, { _id: 'm33', name: 'Engineering Colleges' },
  { _id: 'm113', name: 'Manpower Agencies' },
  { _id: 'm34', name: 'Medical Colleges' }, { _id: 'm35', name: 'IAS/UPSC Coaching' }, { _id: 'm36', name: 'IIT/JEE Coaching' },
  { _id: 'm37', name: 'Bank/SSC Coaching' }, { _id: 'm38', name: 'Computer Training' }, { _id: 'm39', name: 'Spoken English Classes' },
  { _id: 'm40', name: 'Music Classes' }, { _id: 'm41', name: 'Dance Classes' }, { _id: 'm42', name: 'Home Tutors' },
  { _id: 'm43', name: 'Abacus Classes' }, { _id: 'm44', name: 'Drawing Classes' }, { _id: 'm45', name: 'Library' },

  // 4. Automotive
  { _id: 'm46', name: 'Car Dealers' }, { _id: 'm47', name: 'Used Car Dealers' }, { _id: 'm48', name: 'Car Repair' },
  { _id: 'm49', name: 'Car Wash Centers' }, { _id: 'm50', name: 'Bike Dealers' }, { _id: 'm51', name: 'Bike Repair Centers' },
  { _id: 'm52', name: 'Tyre Dealers' }, { _id: 'm53', name: 'Battery Dealers' }, { _id: 'm54', name: 'Driving Schools' },
  { _id: 'm55', name: 'Auto Spare Parts' }, { _id: 'm56', name: 'Car Accessories' }, { _id: 'm57', name: 'Towing Services' },

  // 5. Professional Services
  { _id: 'm58', name: 'Lawyers' }, { _id: 'm59', name: 'Chartered Accountants' }, { _id: 'm60', name: 'Tax Consultants' },
  { _id: 'm61', name: 'Insurance Agents' }, { _id: 'm62', name: 'Real Estate Agents' }, { _id: 'm63', name: 'Web Designers' },
  { _id: 'm64', name: 'Graphic Designers' }, { _id: 'm65', name: 'Digital Marketing' }, { _id: 'm66', name: 'IT Companies' },
  { _id: 'm67', name: 'Architects' }, { _id: 'm68', name: 'Civil Contractors' }, { _id: 'm69', name: 'Courier Services' },

  // 6. Food & Shopping
  { _id: 'm70', name: 'Restaurants' }, { _id: 'm71', name: 'Cafes' }, { _id: 'm72', name: 'Bakeries' },
  { _id: 'm73', name: 'Caterers' }, { _id: 'm74', name: 'Clothing Stores' }, { _id: 'm75', name: 'Footwear Shops' },
  { _id: 'm76', name: 'Jewellery Showrooms' }, { _id: 'm77', name: 'Mobile Phone Shops' }, { _id: 'm78', name: 'Electronic Goods' },
  { _id: 'm79', name: 'Supermarkets' }, { _id: 'm80', name: 'Furniture Dealers' }, { _id: 'm81', name: 'Gift Shops' },

  // 7. Lifestyle & Events
  { _id: 'm82', name: 'Banquet Halls' }, { _id: 'm83', name: 'Wedding Planners' }, { _id: 'm84', name: 'Photographers' },
  { _id: 'm85', name: 'Video Editors' }, { _id: 'm86', name: 'Beauty Parlours' }, { _id: 'm87', name: 'Gents Salons' },
  { _id: 'm88', name: 'Gyms' }, { _id: 'm89', name: 'Yoga Centers' }, { _id: 'm90', name: 'Event Managers' },
  { _id: 'm91', name: 'Tent House' }, { _id: 'm92', name: 'Florists' }, { _id: 'm93', name: 'Party Decorators' },

  // 8. Misc & Business
  { _id: 'm94', name: 'Hardware Shops' }, { _id: 'm95', name: 'Sanitaryware Dealers' }, { _id: 'm96', name: 'Tile Dealers' },
  { _id: 'm97', name: 'Solar Panel Dealers' }, { _id: 'm98', name: 'Printing Services' }, { _id: 'm99', name: 'Stationery Shops' },
  { _id: 'm100', name: 'Toy Stores' }, { _id: 'm101', name: 'Sports Goods' }, { _id: 'm102', name: 'Tailors' },
  { _id: 'm103', name: 'Dry Cleaners' }, { _id: 'm104', name: 'Astrologers' }, { _id: 'm105', name: 'Vastu Consultants' },
  { _id: 'm106', name: 'Pet Shops' }, { _id: 'm107', name: 'Veterinary Doctors' }, { _id: 'm108', name: 'Hostels' },
  { _id: 'm109', name: 'PG for Men' }, { _id: 'm110', name: 'PG for Women' }, { _id: 'm111', name: 'Security Services' },
  { _id: 'm112', name: 'Advertising Agencies' }
];
// टॉप १० जो हमेशा ऊपर रहेंगे
const TOP_SERVICES = BACKUP_CATEGORIES.slice(0, 10);

export default function FinalJustdialHome() {
  // ✅ डिफ़ॉल्ट रूप में बैकअप डेटा भर दिया है ताकी स्क्रीन कभी खाली न रहे
  const [categories, setCategories] = useState<any[]>(BACKUP_CATEGORIES); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  
  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        if (res.data && res.data.length > 0) {
          // अगर बैकएंड सही है, तो असली डेटा लगाओ
          setCategories(res.data);
        }
      } catch (err) {
        console.log("Backend 500 Error! Using backup categories to save icons.");
        // एरर आने पर कुछ नहीं करना, categories में पहले से BACKUP_CATEGORIES भरा हुआ है।
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ मंतु भाई, ये रहा आपका नया Master Function
const handleCategoryClick = (category: any) => {
    // १. नाम को URL के हिसाब से 'ac-repair' जैसा बनाएं
    const slug = category.name.toLowerCase().trim().replace(/\s+/g, '-');

    // २. चेक करें कि ID असली है या बैकअप वाली
    // अगर ID असली (MongoDB वाली) है तो उसे 'cid' में डालें, वरना नाम डालें
    const identifier = category._id.length > 15 ? category._id : category.name;

    // ३. अब सीधे लिस्टिंग पर नहीं, बल्कि 'Discovery Page' पर भेजें
    // हम पीछे से 'cid' भेज रहे हैं ताकि अगले पेज को पता रहे कि कौन सी दुकान ढूंढनी है
    router.push(`/services/${slug}?cid=${encodeURIComponent(identifier)}`);
};

  const displayedCats = categories.filter((cat: any) =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-800">
      <JustdialHeader onSearch={(val) => setSearchTerm(val)} />
      <HeroBanners />

      {/* --- ✅ टॉप १० क्विक आइकॉन (Front-end - कभी गायब नहीं होंगे) --- */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-5 md:grid-cols-10 gap-3">
        {TOP_SERVICES.map((item) => {
          const style = getCategoryStyle(item.name);
          return (
            <div key={item._id} onClick={() => handleCategoryClick(item)} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-2xl flex items-center justify-center mb-1.5 border-[1px] border-slate-100 shadow-sm transition-all group-hover:scale-105`}>
                <div className={style.color}>{style.icon}</div>
              </div>
              <p className="text-[9px] font-[1000] text-slate-500 text-center uppercase leading-tight truncate w-full px-1">{item.name}</p>
            </div>
          );
        })}
      </div>

      <SearchDiscovery />
      <CuratedSections />

      {/* --- मेन सर्विस ग्रिड (११०+ आइकॉन) --- */}
      <main className="max-w-7xl mx-auto px-4 mt-12 mb-20">
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-sm border-[1px] border-slate-200">
          <div className="flex justify-between items-center mb-10 px-2">
            <div className="flex items-center gap-2">
              <LayoutGrid size={24} className="text-blue-600" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {searchTerm ? `Searching: "${searchTerm}"` : "Browse All Services"}
              </h3>
            </div>
            <button onClick={() => router.push('/all-categories')} className="text-blue-600 font-bold text-xs flex items-center hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
             {/* ✅ मंतु भाई, यहाँ अब एरर आने पर भी बैकअप डेटा दिखेगा */}
             {displayedCats.map((cat: any) => {
                const style = getCategoryStyle(cat.name);
                return (
                  <div key={cat._id} onClick={() => handleCategoryClick(cat)} className="flex flex-col items-center p-3 rounded-2xl hover:bg-blue-50 transition-all cursor-pointer group text-center">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${style.bg} rounded-full flex items-center justify-center mb-2 mx-auto border border-white shadow-sm transition-transform group-hover:scale-110`}>
                      <div className={style.color}>{style.icon}</div>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate w-full leading-tight">{cat.name}</p>
                  </div>
                )
              })}
          </div>
        </div>
      </main>

      <MegaFooter />
      <InquiryModal selectedCat={selectedCategory} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}