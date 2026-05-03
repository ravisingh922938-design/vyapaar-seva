import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Camera, Save, Tag, FileText, MapPin, Clock, ArrowLeft, Trash2 } from 'lucide-react-native';

export default function EditProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // --- States ---
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [address, setAddress] = useState("");
    const [hours, setHours] = useState("9:00 AM - 8:00 PM");
    const [images, setImages] = useState([]);

    // ✅ लाइव API URL
    const API_BASE = "https://api.vister.in/api";

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.6,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets]);
        }
    };

    const handleSave = async () => {
        if (!description || !keywords) {
            alert("Bhai, Description aur Keywords bharna zaroori hai!");
            return;
        }

        setLoading(true);
        console.log("🚀 Saving Profile...");

        try {
            const sellerDataString = await AsyncStorage.getItem('sellerData');
            const seller = JSON.parse(sellerDataString);
            const vendorId = seller.id || seller._id;

            const formData = new FormData();
            formData.append('description', description);
            formData.append('keywords', keywords);
            formData.append('fullAddress', address);
            formData.append('businessHours', hours);

            images.forEach((img, index) => {
                formData.append('images', {
                    uri: img.uri,
                    name: `photo_${index}.jpg`,
                    type: 'image/jpeg',
                });
            });

            // ✅ प्रोफाइल अपडेट की रिक्वेस्ट
            const res = await axios.put(`${API_BASE}/vendors/update-profile/${vendorId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("✅ Server Response:", res.data);

            if (res.data.status === "success") {
                // मंतु भाई, वेब पर alert() सबसे बेस्ट है
                alert("Mubarak Ho! ✅\nAapki jankari update ho gayi hai.");
                router.back();
            }
        } catch (err) {
            console.error("❌ Save Error:", err.response?.data || err.message);
            alert("Error: Data save nahi ho paya. " + (err.response?.data?.message || "Check connection"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>profile</Text>
            </View>

            <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>BUSINESS DESCRIPTION</Text>
                    <View style={styles.textAreaBox}>
                        <FileText size={18} color="#94a3b8" />
                        <TextInput 
                            multiline numberOfLines={4}
                            style={styles.textArea}
                            placeholder="Describe your work..."
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>SEARCH KEYWORDS (KEYWORDS)</Text>
                    <View style={styles.inputBox}>
                        <Tag size={18} color="#94a3b8" />
                        <TextInput 
                            style={styles.input}
                            placeholder="Tags (Comma separated)"
                            value={keywords}
                            onChangeText={setKeywords}
                        />
                    </View>
                    <Text style={styles.hint}>*कोमा (,) लगा कर शब्द लिखें</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>FULL ADDRESS</Text>
                        <View style={styles.inputBox}>
                            <MapPin size={18} color="#94a3b8" />
                            <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
                        </View>
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>WORKING HOURS</Text>
                        <View style={styles.inputBox}>
                            <Clock size={18} color="#94a3b8" />
                            <TextInput style={styles.input} placeholder="9AM-9PM" value={hours} onChangeText={setHours} />
                        </View>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>GALLERY (दुकान/काम की फोटो)</Text>
                    <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                        <Camera color="#2563eb" size={30} />
                        <Text style={styles.uploadText}>फोटो जोड़ें</Text>
                    </TouchableOpacity>
                    
                    <ScrollView horizontal style={styles.imageScroll}>
                        {images.map((img, i) => (
                            <View key={i} style={styles.imageWrapper}>
                                <Image source={{ uri: img.uri }} style={styles.previewImg} />
                                <TouchableOpacity style={styles.removeBtn} onPress={() => setImages(images.filter((_, idx) => idx !== i))}>
                                    <Trash2 size={12} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Save color="#fff" size={20} />
                            <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginLeft: 15 },
    formCard: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginBottom: 8 },
    inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWeight: 1, borderColor: '#eee', borderRadius: 15, paddingHorizontal: 12, height: 60 },
    textAreaBox: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderWeight: 1, borderColor: '#eee', borderRadius: 15, padding: 12, minHeight: 120 },
    input: { flex: 1, marginLeft: 10, fontWeight: '600' },
    textArea: { flex: 1, marginLeft: 10, fontWeight: '600', textAlignVertical: 'top' },
    hint: { fontSize: 10, color: '#94a3b8', marginTop: 4, fontStyle: 'italic' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    uploadArea: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 25, alignItems: 'center', justifyContent: 'center' },
    uploadText: { color: '#2563eb', fontWeight: 'bold', marginTop: 5 },
    imageScroll: { marginTop: 15 },
    imageWrapper: { marginRight: 10 },
    previewImg: { width: 90, height: 90, borderRadius: 15 },
    removeBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', padding: 5, borderRadius: 10 },
    saveBtn: { backgroundColor: '#2563eb', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    saveBtnText: { color: '#fff', fontWeight: '900', marginLeft: 10, fontSize: 16 }
});