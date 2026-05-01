import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { Store, User, Smartphone, MapPin, Tag, ArrowLeft, CheckCircle } from 'lucide-react-native';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '', shopName: '', phone: '', area: '', category: '', description: 'Patna local expert.'
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCats, setFetchingCats] = useState(true);
    const router = useRouter();

    // Live Production API
    const API_BASE = "https://api.vister.in/api";
    

    // 1. Saari Categories fetch karna (110+)
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                if (res.data) {
                    const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
                    setCategories(sorted);
                }
            } catch (err) {
                console.error("Category Fetch Error:", err);
                Alert.alert("Error", "Categories load nahi ho payi.");
            } finally {
                setFetchingCats(false);
            }
        };
        fetchCats();
    }, []);

    // 2. Registration Logic (Sahi Error Handling ke saath)
    const handleRegister = async () => {
        // Basic Validation
        if (!formData.name || !formData.shopName || formData.phone.length !== 10 || !formData.category || !formData.area) {
            Alert.alert("Adhoori Jankari", "Kripya saari details sahi se bhariye.");
            return;
        }

        setLoading(true);
        try {
            // Backend ko request bhejna
            const response = await axios.post(`${API_BASE}/vendors/register`, formData);

            if (response.status === 201 || response.data.status === "success") {
                Alert.alert(
                    "Mubarak Ho!",
                    "Aapka registration safal raha. Ab aap login kar sakte hain.",
                    [{ text: "Login Karein", onPress: () => router.replace('/') }]
                );
            }
        } catch (error) {
            // --- UPDATED ERROR HANDLING ---
            console.log("Full Error Object:", error.response?.data);

            // Server se aane wala asli message pakadna
            const serverMessage = error.response?.data?.message || "Something went wrong";

            // Mobile screen par asli wajah dikhana
            Alert.alert("Registration Fail", serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Back Button */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color="#64748b" />
                    <Text style={styles.backText}>WAPAS</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Partner Registration</Text>
                    <Text style={styles.subTitle}>Vyapaar Seva se judkar apna dukan badhayein</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputBox}>
                        <User size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Aapka Naam" value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} />
                    </View>

                    <View style={styles.inputBox}>
                        <Store size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Dukan ka Naam" value={formData.shopName} onChangeText={(v) => setFormData({ ...formData, shopName: v })} />
                    </View>

                    <View style={styles.inputBox}>
                        <Smartphone size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" maxLength={10} value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} />
                    </View>

                    <View style={styles.inputBox}>
                        <MapPin size={18} color="#94a3b8" style={styles.icon} />
                        <TextInput style={styles.input} placeholder="Area (e.g. Boring Road)" value={formData.area} onChangeText={(v) => setFormData({ ...formData, area: v })} />
                    </View>

                    <Text style={styles.label}>Apni Service Chunein:</Text>
                    <View style={styles.pickerBox}>
                        <Tag size={18} color="#2563eb" style={styles.icon} />
                        {fetchingCats ? (
                            <ActivityIndicator size="small" color="#2563eb" style={{ marginLeft: 10 }} />
                        ) : (
                            <Picker
                                selectedValue={formData.category}
                                style={styles.picker}
                                onValueChange={(v) => setFormData({ ...formData, category: v })}
                            >
                                <Picker.Item label="Category select karein" value="" color="#94a3b8" />
                                {categories.map((cat) => (
                                    <Picker.Item key={cat._id} label={cat.name.toUpperCase()} value={cat._id} />
                                ))}
                            </Picker>
                        )}
                    </View>

                    <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckCircle size={20} color="#fff" style={{ marginRight: 10 }} />
                                <Text style={styles.buttonText}>CREATE MY ACCOUNT</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, backgroundColor: '#f8fafc', flexGrow: 1 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    backText: { fontSize: 10, fontWeight: 'bold', color: '#64748b', marginLeft: 5 },
    header: { marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', letterSpacing: -1 },
    subTitle: { fontSize: 13, color: '#64748b', marginTop: 5 },
    form: { width: '100%' },
    label: { fontSize: 11, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, textTransform: 'uppercase', marginLeft: 5 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60, borderWidth: 1, borderColor: '#e2e880', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, fontWeight: '600', color: '#334155' },
    pickerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 30, height: 60, borderWidth: 2, borderColor: '#bfdbfe' },
    picker: { flex: 1, height: 60, marginLeft: -10 },
    button: { width: '100%', height: 65, backgroundColor: '#2563eb', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 5 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});