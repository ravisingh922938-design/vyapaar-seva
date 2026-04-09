import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function EditProfile() {
    const { vendorId, vendorName, shop, area } = useLocalSearchParams();
    const [desc, setDesc] = useState('');
    const [address, setAddress] = useState('');
    const [hours, setHours] = useState('9 AM - 9 PM');
    const router = useRouter();

    const handleUpdate = async () => {
        try {
            await axios.put(`http://10.243.86.238:5000/api/vendors/update-profile/${vendorId}`, {
                description: desc,
                address: address,
                businessHours: hours
            });
            Alert.alert("Success ✅", "Aapki dukan ki jankari update ho gayi!");
            router.back();
        } catch (err) { Alert.alert("Error", "Update nahi ho paya."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Dukan ki Jankari (Profile)</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Dukan ka Naam</Text>
                <TextInput style={styles.inputDisabled} value={shop} editable={false} />

                <Text style={styles.label}>Dukan ke baare mein (Description)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Hum Patna mein 10 saal se AC service kar rahe hain..."
                    multiline numberOfLines={3}
                    onChangeText={setDesc}
                />

                <Text style={styles.label}>Dukan ka Pura Pata (Address)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Shop No. 5, Boring Road Chauraha, Patna"
                    onChangeText={setAddress}
                />

                <Text style={styles.label}>Working Hours</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 9:00 AM - 10:00 PM"
                    onChangeText={setHours}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                    <Text style={styles.saveText}>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5, marginTop: 15 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 8, fontSize: 16, color: '#333' },
    inputDisabled: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 8, fontSize: 16, color: '#aaa' },
    saveBtn: { backgroundColor: '#003580', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});