import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({ name: '', shopName: '', phone: '', area: '', category: '' });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Browser testing ke liye 'localhost' hi use karein
    const API_BASE = "http://api.vister.in/api";

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                setCategories(res.data);
            } catch (err) { console.log("Category error"); }
        };
        fetchCats();
    }, []);

    const handleRegister = async () => {
        if (!formData.name || !formData.phone || !formData.category) {
            alert("Saari jankari bhariye!");
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/vendors/register`, formData);
            alert("Registration Done! Login karein.");
            router.replace('/');
        } catch (error) {
            alert(error.response?.data?.message || "Fail ho gaya");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Vister Partner Registration</Text>

            <TextInput style={styles.input} placeholder="Aapka Naam" onChangeText={(v) => setFormData({ ...formData, name: v })} />
            <TextInput style={styles.input} placeholder="Dukan ka Naam" onChangeText={(v) => setFormData({ ...formData, shopName: v })} />
            <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" maxLength={10} onChangeText={(v) => setFormData({ ...formData, phone: v })} />
            <TextInput style={styles.input} placeholder="Area (e.g. Boring Road)" onChangeText={(v) => setFormData({ ...formData, area: v })} />

            <Text style={styles.label}>Category Chunein:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.category}
                    onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
                >
                    <Picker.Item label="Select Category" value="" />
                    {categories.map((cat) => (
                        <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>REGISTER NOW</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 20 }}>
                <Text style={{ color: '#007bff' }}>Back to Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, alignItems: 'center', backgroundColor: '#f9f9f9', flexGrow: 1 },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 30, color: '#333' },
    label: { alignSelf: 'flex-start', marginBottom: 5, fontWeight: 'bold', color: '#666' },
    input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    pickerContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 10, marginBottom: 20 },
    button: { width: '100%', height: 55, backgroundColor: '#28a745', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});