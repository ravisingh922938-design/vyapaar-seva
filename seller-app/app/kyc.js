import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function KYCCenter() {
    const { vendorId } = useLocalSearchParams();
    const [aadhaar, setAadhaar] = useState('');
    const [pan, setPan] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        if (aadhaar.length < 12) return Alert.alert("Error", "Sahi Aadhaar number daliye");
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/submit-kyc`, {
                vendorId, aadhaar, pan
            });
            Alert.alert("Documents Submitted! 📄", "Aapka 'Verified' badge 24-48 ghante mein chalu ho jayega.");
            router.back();
        } catch (err) { Alert.alert("Error", "Submit nahi ho paya"); }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.badgePreview}>
                <Text style={styles.badgeIcon}>🛡️</Text>
                <Text style={styles.badgeTitle}>Get Vister Verified Badge</Text>
                <Text style={styles.badgeSub}>Verified dukaandaron ko 5 guna zyada grahak milte hain.</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Aadhaar Card Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="12 Digit Aadhaar No."
                    keyboardType="numeric"
                    maxLength={12}
                    onChangeText={setAadhaar}
                />

                <Text style={styles.label}>PAN Card Number (Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ABCDE1234F"
                    autoCapitalize="characters"
                    onChangeText={setPan}
                />

                <TouchableOpacity style={styles.uploadBtn} onPress={() => Alert.alert("Photo", "Aadhaar ki photo upload karein")}>
                    <Text style={styles.uploadText}>📸 Upload Aadhaar Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitText}>VERIFY MY BUSINESS</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Verified Hone Ke Fayde:</Text>
                <Text style={styles.infoText}>• Search mein "Blue Tick" dikhega.</Text>
                <Text style={styles.infoText}>• Grahak aap par zyada bharosa karenge.</Text>
                <Text style={styles.infoText}>• Platinum membership ke liye KYC zaroori hai.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    badgePreview: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    badgeIcon: { fontSize: 60, marginBottom: 10 },
    badgeTitle: { fontSize: 22, fontWeight: 'bold', color: '#003580' },
    badgeSub: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 5 },
    card: { backgroundColor: '#fff', padding: 25, borderRadius: 25, elevation: 5 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#444', marginBottom: 8 },
    input: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#EEE' },
    uploadBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#003580', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
    uploadText: { color: '#003580', fontWeight: 'bold' },
    submitBtn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, alignItems: 'center' },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    infoBox: { marginTop: 30, backgroundColor: '#E8F5E9', padding: 20, borderRadius: 20, marginBottom: 50 },
    infoTitle: { fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
    infoText: { fontSize: 13, color: '#444', marginBottom: 5 }
});