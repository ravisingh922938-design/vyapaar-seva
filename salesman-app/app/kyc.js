import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // 📸 Photo khichne ke liye
import axios from 'axios';
import { ShieldCheck, Camera, FileText, MapPin, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SalesmanKYC() {
    const [loading, setLoading] = useState(false);
    const [aadhaar, setAadhaar] = useState("");
    const [pan, setPan] = useState("");
    const [address, setAddress] = useState("");
    const [aadhaarImg, setAadhaarImg] = useState(null);
    const [panImg, setPanImg] = useState(null);
    const router = useRouter();

    // --- 📸 Photo Pick karne ka function ---
    const pickImage = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled) {
            if (type === 'aadhaar') setAadhaarImg(result.assets[0].uri);
            else setPanImg(result.assets[0].uri);
        }
    };

    const handleKYCSubmit = async () => {
        if (!aadhaar || !pan || !aadhaarImg || !panImg) {
            return Alert.alert("Rukiye", "Saare documents aur photos zaroori hain!");
        }

        setLoading(true);
        try {
            const salesmanId = await AsyncStorage.getItem('salesmanId');

            // Photo bhejne ke liye FormData chahiye
            const formData = new FormData();
            formData.append('salesmanId', salesmanId);
            formData.append('aadhaarNumber', aadhaar);
            formData.append('panNumber', pan);
            formData.append('address', address);

            formData.append('aadhaarPhoto', {
                uri: aadhaarImg,
                name: 'aadhaar.jpg',
                type: 'image/jpeg',
            });
            formData.append('panPhoto', {
                uri: panImg,
                name: 'pan.jpg',
                type: 'image/jpeg',
            });

            await axios.post("https://api.vister.in/api/sales/submit-kyc", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Alert.alert("Success", "Aapka KYC submit ho gaya hai. Admin jald verify karega.");
            router.back();
        } catch (err) {
            Alert.alert("Error", "Server issue, dobara try karein.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 40, marginBottom: 20 }}>
                <ArrowLeft color="#1e293b" size={24} />
            </TouchableOpacity>

            <View style={styles.header}>
                <ShieldCheck color="#2563eb" size={40} />
                <Text style={styles.title}>Identity Verification</Text>
                <Text style={styles.subtitle}>Sureraksha ke liye KYC zaroori hai</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>AADHAAR NUMBER</Text>
                    <TextInput placeholder="12 Digit Aadhaar" style={styles.input} keyboardType="number-pad" onChangeText={setAadhaar} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PAN NUMBER</Text>
                    <TextInput placeholder="ABCDE1234F" style={styles.input} autoCapitalize="characters" onChangeText={setPan} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PERMANENT ADDRESS</Text>
                    <TextInput placeholder="Poora pata likhein" style={styles.input} multiline onChangeText={setAddress} />
                </View>

                {/* Photo Upload Sections */}
                <Text style={styles.label}>UPLOAD DOCUMENTS</Text>
                <View style={styles.photoRow}>
                    <TouchableOpacity style={styles.photoBox} onPress={() => pickImage('aadhaar')}>
                        {aadhaarImg ? <Image source={{ uri: aadhaarImg }} style={styles.preview} /> : <View style={styles.placeholder}><Camera size={20} color="#94a3b8" /><Text style={styles.photoText}>Aadhaar Photo</Text></View>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.photoBox} onPress={() => pickImage('pan')}>
                        {panImg ? <Image source={{ uri: panImg }} style={styles.preview} /> : <View style={styles.placeholder}><Camera size={20} color="#94a3b8" /><Text style={styles.photoText}>PAN Photo</Text></View>}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleKYCSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>SUBMIT DOCUMENTS</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 25 },
    header: { alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: '900', color: '#1e293b', marginTop: 10 },
    subtitle: { fontSize: 13, color: '#64748b' },
    form: { marginTop: 10 },
    label: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
    input: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, borderWeight: 1, borderColor: '#e2e8f0', fontWeight: 'bold' },
    photoRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
    photoBox: { flex: 1, height: 120, backgroundColor: '#f8fafc', borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#cbd5e1', overflow: 'hidden' },
    placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    photoText: { fontSize: 10, color: '#94a3b8', marginTop: 5, fontWeight: 'bold' },
    preview: { width: '100%', height: '100%' },
    submitBtn: { backgroundColor: '#2563eb', padding: 20, borderRadius: 20, marginTop: 40, alignItems: 'center', elevation: 5 },
    submitText: { color: '#fff', fontWeight: '900', letterSpacing: 1 }
});