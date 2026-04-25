import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Store, User, Smartphone, Mail, Lock, ArrowLeft, MapPin, Hash, Tag, Globe } from 'lucide-react-native';

export default function AddSellerScreen() {
    const [formData, setFormData] = useState({ 
        name: '', 
        shopName: '', 
        phone: '', 
        email: '', 
        password: '', 
        category: '', 
        area: '', 
        city: '', 
        state: 'Bihar', 
        pincode: '',
        tags: '' // सेल्समैन यहाँ कोमा लगाकर कीवर्ड्स लिखेगा
    });
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const API_BASE = "https://api.vister.in/api";

    useEffect(() => {
        axios.get(`${API_BASE}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.log("Cat Error"));
    }, []);

    const handleAddSeller = async () => {
        // ✅ वैलिडेशन
        if (!formData.email || !formData.phone || !formData.pincode || !formData.category) {
            return Alert.alert("रुको!", "ईमेल, फोन, पिनकोड और कैटेगरी भरना ज़रूरी है।");
        }

        setLoading(true);
        try {
            const salesmanId = await AsyncStorage.getItem('salesmanId');
            
            // ✅ कीवर्ड्स को एरे (Array) में बदलना
            const keywordArray = formData.tags.split(',').map(k => k.trim()).filter(k => k !== "");

            const finalData = {
                ...formData,
                keywords: keywordArray, // बैकएंड में 'keywords' नाम से जाएगा
                salesmanId: salesmanId
            };

            const res = await axios.post(`${API_BASE}/vendors/register`, finalData);

            if (res.data.status === "success") {
                Alert.alert("बधाई हो!", "दुकान रजिस्टर हो गई और कीवर्ड्स भी जुड़ गए हैं।");
                router.back();
            }
        } catch (err) {
            console.log(err.response?.data);
            Alert.alert("गलती!", err.response?.data?.message || "Registration fail!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 50}}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={20} color="#1e293b" />
                <Text style={styles.backText}>WAPAS</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Add New Seller</Text>
            <Text style={styles.subTitle}>दुकान की पूरी जानकारी भरें</Text>

            <View style={styles.form}>
                {/* १. दुकान का नाम */}
                <View style={styles.inputBox}>
                    <Store size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Shop Name" style={styles.input} onChangeText={(v) => setFormData({ ...formData, shopName: v })} />
                </View>

                {/* २. मालिक का नाम */}
                <View style={styles.inputBox}>
                    <User size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Owner Name" style={styles.input} onChangeText={(v) => setFormData({ ...formData, name: v })} />
                </View>

                {/* ३. फोन और ईमेल */}
                <View style={styles.inputBox}>
                    <Smartphone size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Phone" keyboardType="phone-pad" maxLength={10} style={styles.input} onChangeText={(v) => setFormData({ ...formData, phone: v })} />
                </View>
                <View style={styles.inputBox}>
                    <Mail size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Email Address" style={styles.input} onChangeText={(v) => setFormData({ ...formData, email: v })} />
                </View>

                {/* ४. पासवर्ड */}
                <View style={styles.inputBox}>
                    <Lock size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Set Login Password" secureTextEntry style={styles.input} onChangeText={(v) => setFormData({ ...formData, password: v })} />
                </View>

                {/* ५. एरिया और पिनकोड */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={[styles.inputBox, {width: '48%'}]}>
                        <MapPin size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput placeholder="Area" style={styles.input} onChangeText={(v) => setFormData({ ...formData, area: v })} />
                    </View>
                    <View style={[styles.inputBox, {width: '48%'}]}>
                        <Hash size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput placeholder="Pincode" keyboardType="number-pad" maxLength={6} style={styles.input} onChangeText={(v) => setFormData({ ...formData, pincode: v })} />
                    </View>
                </View>

                {/* ६. सिटी */}
                <View style={styles.inputBox}>
                    <Globe size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="City (e.g. Patna, Delhi)" style={styles.input} onChangeText={(v) => setFormData({ ...formData, city: v })} />
                </View>

                {/* ७. कीवर्ड्स (जुगाड़) */}
                <Text style={styles.label}>Keywords (comma लगा कर लिखें):</Text>
                <View style={[styles.inputBox, {height: 80}]}>
                    <Tag size={18} color="#2563eb" style={styles.icon} />
                    <TextInput 
                        placeholder="AC, Repair, Service, Installation..." 
                        multiline 
                        style={styles.input} 
                        onChangeText={(v) => setFormData({ ...formData, tags: v })} 
                    />
                </View>

                <Text style={styles.label}>Category:</Text>
                <View style={styles.pickerBox}>
                    <Picker
                        selectedValue={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                        <Picker.Item label="Select Category" value="" />
                        {categories.map((cat) => <Picker.Item key={cat._id} label={cat.name} value={cat._id} />)}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleAddSeller} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>SAVE & LIST BUSINESS</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
    backText: { marginLeft: 10, fontWeight: 'bold', fontSize: 12 },
    title: { fontSize: 26, fontWeight: '900', color: '#1e293b' },
    subTitle: { fontSize: 13, color: '#64748b', marginBottom: 25 },
    form: { marginBottom: 20 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontWeight: '600', color: '#334155' },
    label: { fontSize: 11, fontWeight: '900', marginBottom: 8, color: '#475569', textTransform: 'uppercase' },
    pickerBox: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 30, elevation: 3 },
    submitBtn: { backgroundColor: '#2563eb', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    btnText: { color: '#fff', fontWeight: '900', letterSpacing: 1, fontSize: 16 }
});