import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function BusinessLoan() {
    const { vendorId } = useLocalSearchParams();
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [turnover, setTurnover] = useState('');

    const handleApply = async () => {
        if (!amount || !purpose || !turnover) return Alert.alert("Error", "Saari jankari bhariye");
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/apply-loan`, {
                vendorId, amountNeeded: amount, purpose, monthlyTurnover: turnover
            });
            Alert.alert("Success ✅", "Application Sent! Aapko jald Vister Capital team call karegi.");
            setAmount(''); setPurpose(''); setTurnover('');
        } catch (err) { Alert.alert("Error", "Server Error"); }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heroCard}>
                <Text style={styles.heroTitle}>Vister Capital 💰</Text>
                <Text style={styles.heroSub}>Patna ke dukaandaron ke liye asaan Business Loan</Text>
                <Text style={styles.interestText}>Interest starting at 1.5% p.m.</Text>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>Kitna Loan Chahiye? (₹)</Text>
                <TextInput style={styles.input} keyboardType="numeric" placeholder="e.g. 50000" onChangeText={setAmount} value={amount} />

                <Text style={styles.label}>Loan kis liye chahiye?</Text>
                <TextInput style={styles.input} placeholder="e.g. Naya AC kharidna hai" onChangeText={setPurpose} value={purpose} />

                <Text style={styles.label}>Mahine ki kamayi (Turnover)</Text>
                <TextInput style={styles.input} placeholder="e.g. 1 Lakh - 2 Lakh" onChangeText={setTurnover} value={turnover} />

                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                    <Text style={styles.applyText}>APPLY FOR LOAN</Text>
                </TouchableOpacity>
            </View>

            {/* Trust Features */}
            <View style={styles.trustSection}>
                <Text style={styles.trustItem}>✅ No Security Required</Text>
                <Text style={styles.trustItem}>✅ Minimal Documentation</Text>
                <Text style={styles.trustItem}>✅ Same Day Approval</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
    heroCard: { backgroundColor: '#003580', padding: 30, borderRadius: 25, marginBottom: 20, elevation: 5 },
    heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFD700' },
    heroSub: { color: '#fff', fontSize: 14, marginTop: 5, opacity: 0.8 },
    interestText: { color: '#00FF00', fontWeight: 'bold', marginTop: 15 },
    formCard: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 3 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
    applyBtn: { backgroundColor: '#28a745', padding: 18, borderRadius: 15, alignItems: 'center' },
    applyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    trustSection: { marginTop: 30, padding: 10, alignItems: 'center', marginBottom: 50 },
    trustItem: { color: '#666', fontSize: 14, marginBottom: 8, fontWeight: '500' }
});