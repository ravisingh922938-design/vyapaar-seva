import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Store, User, Smartphone, Mail, Lock, ArrowLeft } from 'lucide-react-native';

export default function AddSellerScreen() {
    const [formData, setFormData] = useState({ name: '', shopName: '', phone: '', email: '', password: '', category: '', area: 'Patna' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const API_BASE = "https://api.vister.in/api";

    useEffect(() => {
        // Categories load karein dropdown ke liye
        axios.get(`${API_BASE}/categories`).then(res => setCategories(res.data));
    }, []);

    const handleAddSeller = async () => {
        if (!formData.email || !formData.password || !formData.phone) {
            return Alert.alert("Rukiye!", "Email, Password aur Phone bharna zaroori hai.");
        }

        setLoading(true);
        try {
            const salesmanId = await AsyncStorage.getItem('salesmanId');

            // Backend ko salesmanId ke saath data bhej rahe hain
            const res = await axios.post(`${API_BASE}/vendors/register`, {
                ...formData,
                salesmanId: salesmanId // 🔥 Isse lead auto-lock ho jayegi
            });

            if (res.data.status === "success") {
                Alert.alert("Mubarak Ho!", "Nayi dukan add ho gayi aur aapki list me jodh di gayi hai.");
                router.back(); // Dashboard par wapas jayein
            }
        } catch (err) {
            Alert.alert("Galti!", err.response?.data?.message || "Registration fail!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={20} color="#1e293b" />
                <Text style={styles.backText}>WAPAS</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Add New Seller</Text>
            <Text style={styles.subTitle}>Dukan ki jankari bhariye</Text>

            <View style={styles.form}>
                <View style={styles.inputBox}>
                    <Store size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Shop Name" style={styles.input} onChangeText={(v) => setFormData({ ...formData, shopName: v })} />
                </View>

                <View style={styles.inputBox}>
                    <User size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Owner Name" style={styles.input} onChangeText={(v) => setFormData({ ...formData, name: v })} />
                </View>

                <View style={styles.inputBox}>
                    <Smartphone size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Phone Number" keyboardType="phone-pad" maxLength={10} style={styles.input} onChangeText={(v) => setFormData({ ...formData, phone: v })} />
                </View>

                <View style={styles.inputBox}>
                    <Mail size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Email Address" style={styles.input} onChangeText={(v) => setFormData({ ...formData, email: v })} />
                </View>

                <View style={styles.inputBox}>
                    <Lock size={18} color="#94a3b8" style={styles.icon} />
                    <TextInput placeholder="Set Password" secureTextEntry style={styles.input} onChangeText={(v) => setFormData({ ...formData, password: v })} />
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
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>REGISTER SELLER</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 40 },
    backText: { marginLeft: 10, fontWeight: 'bold', fontSize: 12 },
    title: { fontSize: 28, fontWeight: '900', color: '#1e293b' },
    subTitle: { fontSize: 14, color: '#64748b', marginBottom: 30 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60, elevation: 2 },
    icon: { marginRight: 10 },
    input: { flex: 1, fontWeight: 'bold' },
    label: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#64748b' },
    pickerBox: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 30, elevation: 2 },
    submitBtn: { backgroundColor: '#2563eb', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    btnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 }
});