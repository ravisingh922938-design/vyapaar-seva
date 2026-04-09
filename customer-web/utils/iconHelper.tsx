// customer-web/utils/iconHelper.tsx
import {
    Stethoscope, School, Zap, Droplets, Hammer, Car, Home, Utensils, HeartPulse,
    ShoppingBag, Camera, Monitor, Smartphone, Gavel, GraduationCap, Pill,
    Activity, AirVent, BookOpen, Building2, Bike, PartyPopper, Calculator,
    Scale, Megaphone, Wind, Ambulance, DraftingCompass, Settings, BatteryCharging,
    Wrench, Hotel, Music, Briefcase, Construction, Waves, Gem, ShieldCheck,
    Truck, Scissors, Users, Wifi, Tv, HardDrive, Map, Store, Shirt, Brush, Pencil, Microscope, Phone, Package
} from 'lucide-react';

export const getCategoryStyle = (name: string) => {
    const n = name?.toLowerCase() || "";

    // 1. Medical & Health
    if (n.includes('ambulance')) return { icon: <Ambulance size={22} />, bg: 'bg-red-100', color: 'text-red-600' };
    if (n.includes('hospital')) return { icon: <Building2 size={22} />, bg: 'bg-red-50', color: 'text-red-600' };
    if (n.includes('clinic') || n.includes('doctor') || n.includes('ayurvedic') || n.includes('cardiologist') || n.includes('dentist') || n.includes('dermatologist'))
        return { icon: <Stethoscope size={22} />, bg: 'bg-rose-50', color: 'text-rose-600' };
    if (n.includes('pharmacy') || n.includes('chemist') || n.includes('diagnostic')) return { icon: <Pill size={22} />, bg: 'bg-emerald-50', color: 'text-emerald-600' };
    if (n.includes('blood bank')) return { icon: <HeartPulse size={22} />, bg: 'bg-red-50', color: 'text-red-500' };

    // 2. Education
    if (n.includes('school') || n.includes('college') || n.includes('engineering') || n.includes('university')) return { icon: <GraduationCap size={22} />, bg: 'bg-blue-50', color: 'text-blue-700' };
    if (n.includes('coaching') || n.includes('tutor') || n.includes('training')) return { icon: <BookOpen size={22} />, bg: 'bg-indigo-50', color: 'text-indigo-600' };
    if (n.includes('abacus') || n.includes('calculator')) return { icon: <Calculator size={22} />, bg: 'bg-cyan-50', color: 'text-cyan-600' };

    // 3. Automotive (Car & Bike)
    if (n.includes('car dealer')) return { icon: <Car size={22} />, bg: 'bg-blue-100', color: 'text-blue-700' };
    if (n.includes('car repair') || n.includes('car wash') || n.includes('car accessories')) return { icon: <Wrench size={22} />, bg: 'bg-slate-100', color: 'text-slate-700' };
    if (n.includes('bike')) return { icon: <Bike size={22} />, bg: 'bg-zinc-100', color: 'text-zinc-800' };
    if (n.includes('battery')) return { icon: <BatteryCharging size={22} />, bg: 'bg-yellow-50', color: 'text-yellow-700' };
    if (n.includes('auto spare parts')) return { icon: <Settings size={22} />, bg: 'bg-gray-100', color: 'text-gray-600' };
    if (n.includes('driving school')) return { icon: <Map size={22} />, bg: 'bg-orange-50', color: 'text-orange-700' };

    // 4. Home Services & Repair
    if (n.includes('electrician')) return { icon: <Zap size={22} />, bg: 'bg-yellow-50', color: 'text-yellow-600' };
    if (n.includes('plumber')) return { icon: <Droplets size={22} />, bg: 'bg-sky-50', color: 'text-sky-600' };
    if (n.includes('ac repair')) return { icon: <AirVent size={22} />, bg: 'bg-teal-50', color: 'text-teal-600' };
    if (n.includes('carpenter')) return { icon: <Hammer size={22} />, bg: 'bg-orange-50', color: 'text-orange-800' };
    if (n.includes('cctv')) return { icon: <Camera size={22} />, bg: 'bg-slate-100', color: 'text-slate-800' };

    // 5. Business & Professional
    if (n.includes('advertising') || n.includes('marketing')) return { icon: <Megaphone size={22} />, bg: 'bg-purple-50', color: 'text-purple-600' };
    if (n.includes('architect') || n.includes('builders') || n.includes('contractors')) return { icon: <DraftingCompass size={22} />, bg: 'bg-amber-50', color: 'text-amber-700' };
    if (n.includes('chartered accountant') || n.includes('ca')) return { icon: <Scale size={22} />, bg: 'bg-stone-100', color: 'text-stone-700' };
    if (n.includes('courier')) return { icon: <Package size={22} />, bg: 'bg-blue-50', color: 'text-blue-500' };
    if (n.includes('it company') || n.includes('software') || n.includes('computer')) return { icon: <Monitor size={22} />, bg: 'bg-slate-800', color: 'text-white' };

    // 6. Lifestyle & Events
    if (n.includes('banquet') || n.includes('wedding') || n.includes('decorator') || n.includes('party')) return { icon: <PartyPopper size={22} />, bg: 'bg-pink-50', color: 'text-pink-600' };
    if (n.includes('restaurant') || n.includes('food') || n.includes('caterer')) return { icon: <Utensils size={22} />, bg: 'bg-orange-500', color: 'text-white' };
    if (n.includes('clothing') || n.includes('store')) return { icon: <Shirt size={22} />, bg: 'bg-violet-50', color: 'text-violet-600' };
    if (n.includes('dance')) return { icon: <Music size={22} />, bg: 'bg-fuchsia-50', color: 'text-fuchsia-600' };

    // Default Fallback
    return { icon: <Briefcase size={22} />, bg: 'bg-gray-50', color: 'text-gray-400' };
};