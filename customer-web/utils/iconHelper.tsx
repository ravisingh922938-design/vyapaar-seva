// customer-web/utils/iconHelper.tsx
import {
    Stethoscope, School, Zap, Droplets, Hammer, Car, Home, Utensils, HeartPulse,
    ShoppingBag, Camera, Monitor, Smartphone, Gavel, GraduationCap, Pill,
    Activity, AirVent, BookOpen, Building2, Bike, PartyPopper, Calculator,
    Scale, Megaphone, Wind, Ambulance, DraftingCompass, Settings, BatteryCharging,
    Wrench, Hotel, Music, Briefcase, Construction, Waves, Gem, ShieldCheck,
    Truck, Scissors, Users, Wifi, Tv, HardDrive, Map, Store, Shirt, Brush, Pencil, 
    Microscope, Phone, Package, Sparkles, Brain, Library, Palette, Video, Bus,
    Dumbbell, Coffee, Baby, Key, Crosshair, Paintbrush, Plane, Globe, Bath
} from 'lucide-react';

export const getCategoryStyle = (name: string) => {
    const n = name?.toLowerCase() || "";

    // ✅ मंतु भाई, यहाँ 'Keyword' के आधार पर आइकॉन सेट हैं
    // 1. Health & Medical
    if (n.includes('ambulance')) return { icon: <Ambulance size={24} />, bg: 'bg-red-50', color: 'text-red-600' };
    if (n.includes('hospital') || n.includes('nursing')) return { icon: <Building2 size={24} />, bg: 'bg-rose-50', color: 'text-rose-600' };
    if (n.includes('doctor') || n.includes('clinic') || n.includes('dentist') || n.includes('ayurvedic') || n.includes('specialist')) 
        return { icon: <Stethoscope size={24} />, bg: 'bg-rose-50', color: 'text-rose-500' };
    if (n.includes('pharmacy') || n.includes('chemist') || n.includes('lab') || n.includes('diagnostic')) 
        return { icon: <Pill size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-600' };
    if (n.includes('manpower') || n.includes('agency')) {
    return { icon: <Users size={24} />, bg: 'bg-blue-50', color: 'text-blue-600' };
}

    // 2. Education
    if (n.includes('school') || n.includes('college') || n.includes('university') || n.includes('engineering')) 
        return { icon: <GraduationCap size={24} />, bg: 'bg-blue-50', color: 'text-blue-700' };
    if (n.includes('coaching') || n.includes('tutor') || n.includes('classes') || n.includes('training') || n.includes('ias') || n.includes('iit')) 
        return { icon: <BookOpen size={24} />, bg: 'bg-indigo-50', color: 'text-indigo-600' };
    if (n.includes('abacus') || n.includes('math') || n.includes('calculator')) 
        return { icon: <Calculator size={24} />, bg: 'bg-cyan-50', color: 'text-cyan-600' };

    // 3. Automotive
    if (n.includes('car dealer') || n.includes('used car') || n.includes('showroom')) 
        return { icon: <Car size={24} />, bg: 'bg-sky-100', color: 'text-sky-700' };
    if (n.includes('car repair') || n.includes('service') || n.includes('mechanic') || n.includes('tyre') || n.includes('wash')) 
        return { icon: <Wrench size={24} />, bg: 'bg-slate-100', color: 'text-slate-700' };
    if (n.includes('bike') || n.includes('scooter') || n.includes('motorcycle')) 
        return { icon: <Bike size={24} />, bg: 'bg-zinc-100', color: 'text-zinc-800' };

    // 4. Home Services & Maintenance
    if (n.includes('electrician') || n.includes('electrical')) return { icon: <Zap size={24} />, bg: 'bg-yellow-50', color: 'text-yellow-600' };
    if (n.includes('plumber') || n.includes('water') || n.includes('tank') || n.includes('borewell')) 
        return { icon: <Droplets size={24} />, bg: 'bg-sky-50', color: 'text-sky-600' };
    if (n.includes('ac repair') || n.includes('refrigerator') || n.includes('washing') || n.includes('fridge')) 
        return { icon: <AirVent size={24} />, bg: 'bg-teal-50', color: 'text-teal-600' };
    if (n.includes('carpenter') || n.includes('furniture') || n.includes('interior')) 
        return { icon: <Hammer size={24} />, bg: 'bg-orange-50', color: 'text-orange-800' };
    if (n.includes('cctv') || n.includes('security') || n.includes('guard')) 
        return { icon: <Camera size={24} />, bg: 'bg-slate-100', color: 'text-slate-800' };
    if (n.includes('painting') || n.includes('painter')) return { icon: <Paintbrush size={24} />, bg: 'bg-amber-50', color: 'text-amber-600' };

    // 5. Food & Lifestyle
    if (n.includes('restaurant') || n.includes('food') || n.includes('cafe') || n.includes('bakery') || n.includes('caterer')) 
        return { icon: <Utensils size={24} />, bg: 'bg-orange-500', color: 'text-white' };
    if (n.includes('banquet') || n.includes('wedding') || n.includes('event') || n.includes('party') || n.includes('decorator')) 
        return { icon: <PartyPopper size={24} />, bg: 'bg-pink-50', color: 'text-pink-600' };
    if (n.includes('gym') || n.includes('fitness') || n.includes('yoga')) return { icon: <Dumbbell size={24} />, bg: 'bg-emerald-50', color: 'text-emerald-700' };

    // 6. Professional Services
    if (n.includes('lawyer') || n.includes('advocate') || n.includes('legal')) return { icon: <Gavel size={24} />, bg: 'bg-stone-100', color: 'text-stone-700' };
    if (n.includes('ca ') || n.includes('accountant') || n.includes('tax') || n.includes('gst')) return { icon: <Scale size={24} />, bg: 'bg-gray-100', color: 'text-gray-700' };
    if (n.includes('packers') || n.includes('movers') || n.includes('courier') || n.includes('transport')) 
        return { icon: <Truck size={24} />, bg: 'bg-orange-100', color: 'text-orange-700' };
    if (n.includes('web') || n.includes('software') || n.includes('it company') || n.includes('app') || n.includes('digital')) 
        return { icon: <Monitor size={24} />, bg: 'bg-slate-800', color: 'text-white' };

    // 7. Shopping
    if (n.includes('clothing') || n.includes('store') || n.includes('shop') || n.includes('gift') || n.includes('mall')) 
        return { icon: <ShoppingBag size={24} />, bg: 'bg-violet-50', color: 'text-violet-600' };
    if (n.includes('jewellery') || n.includes('gold')) return { icon: <Gem size={24} />, bg: 'bg-yellow-100', color: 'text-yellow-600' };

    // Default Fallback (अगर कोई कीवर्ड मैच न हो)
    return { icon: <Store size={24} />, bg: 'bg-gray-50', color: 'text-gray-400' };
};