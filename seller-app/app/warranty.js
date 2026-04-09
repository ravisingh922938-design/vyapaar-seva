import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function IssueWarranty() {
    const { vendorId, shop } = useLocalSearchParams();
    const [form, setForm] = useState({ phone: '', service: '', amount: '', months: '3' });
    const router = useRouter();

    const handleIssue = async () => {
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/issue-warranty`, {
                vendorId, customerPhone: form.phone, serviceName: form.service, amountPaid: form.amount, warrantyMonths: form.months
            });

            Alert.alert("Success! 📄", "Grahak ko Digital Warranty bhej di gayi hai.");
            router.back();
        } catch (err) { Alert.alert("Error", "Warranty generate nahi hui."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Digital Warranty Card 🛡️</Text>
            <Text style={styles.sub}>Grahak ka bharosa badhaiye</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Customer Mobile No.</Text>
                <TextInput style={styles.input} keyboardType="numeric" maxLength={10} onChangeText={(v) => setForm({ ...form, phone: v })} />

                <Text style={styles.label}>Kaam ka Vivran (Service Details)</Text>
                <TextInput style={styles.input} placeholder="e.g. Gas Refilling" onChangeText={(v) => setForm({ ...form, service: v })} />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Total Bill (₹)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, amount: v })} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Warranty (Months)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" defaultValue="3" onChangeText={(v) => setForm({ ...form, months: v })} />
                    </View>
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleIssue}>
                    <Text style={styles.btnText}>ISSUE DIGITAL WARRANTY</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.noteBox}>
                <Text style={styles.noteText}>Fayda: Grahak ko SMS/WhatsApp jayega aur wo hamesha aap hi ko call karega.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#003580' },
    sub: { fontSize: 14, color: '#666', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 5 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 10, marginBottom: 20, fontSize: 16 },
    btn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    noteBox: { marginTop: 30, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 10 },
    noteText: { fontSize: 12, color: '#003580', fontStyle: 'italic', textAlign: 'center' }
});