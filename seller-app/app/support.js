import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function SupportPage() {
    const { vendorId } = useLocalSearchParams();
    const [issue, setIssue] = useState('Recharge Issue');
    const [msg, setMsg] = useState('');

    const handleWhatsApp = () => {
        // Apne Business WhatsApp number yahan dalo
        const phone = "91XXXXXXXXXX";
        const url = `whatsapp://send?phone=${phone}&text=Hello Vister Team, I am a Seller and I need help.`;
        Linking.openURL(url).catch(() => Alert.alert("Error", "WhatsApp install nahi hai."));
    };

    const handleSubmitTicket = async () => {
        if (!msg) return Alert.alert("Galti", "Kripya apni samasya likhein.");
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/support`, {
                vendorId, issueType: issue, message: msg
            });
            Alert.alert("Success ✅", "Humne aapki complaint le li hai. 24 ghante mein call aayega.");
            setMsg('');
        } catch (err) { Alert.alert("Error", "Ticket generate nahi ho paya."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Vister Business Care 🎧</Text>

            {/* 1. DIRECT WHATSAPP BUTTON */}
            <TouchableOpacity style={styles.waButton} onPress={handleWhatsApp}>
                <Text style={styles.waText}>💬 Chat on WhatsApp</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>--- OR RAISE A TICKET ---</Text>

            {/* 2. SUPPORT FORM */}
            <View style={styles.card}>
                <Text style={styles.label}>Select Issue Type</Text>
                <View style={styles.pickerRow}>
                    {['Recharge Issue', 'Fake Lead', 'Other'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[styles.chip, issue === item && styles.activeChip]}
                            onPress={() => setIssue(item)}
                        >
                            <Text style={[styles.chipText, issue === item && styles.activeChipText]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Describe your problem</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Apni samasya vistaar mein likhein..."
                    multiline numberOfLines={5}
                    value={msg}
                    onChangeText={setMsg}
                />

                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitTicket}>
                    <Text style={styles.submitText}>Submit Complaint</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerInfo}>
                <Text style={styles.infoText}>📧 support@vister.in</Text>
                <Text style={styles.infoText}>📞 +91 8292920911 (10 AM - 7 PM)</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 25 },
    waButton: { backgroundColor: '#25D366', padding: 18, borderRadius: 15, alignItems: 'center', elevation: 5 },
    waText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    orText: { textAlign: 'center', marginVertical: 30, color: '#999', fontWeight: 'bold' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10 },
    pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
    activeChip: { backgroundColor: '#003580', borderColor: '#003580' },
    chipText: { color: '#666', fontSize: 12 },
    activeChipText: { color: '#fff', fontWeight: 'bold' },
    input: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: '#EEE' },
    submitBtn: { backgroundColor: '#003580', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 25 },
    submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    footerInfo: { marginTop: 40, alignItems: 'center', marginBottom: 30 },
    infoText: { color: '#888', fontSize: 14, marginBottom: 5 }
});