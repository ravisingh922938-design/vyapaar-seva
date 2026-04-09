import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function ProfitLossPage() {
    const { vendorId } = useLocalSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expName, setExpName] = useState('');
    const [expAmt, setExpAmt] = useState('');

    const API_BASE = "http://10.243.86.238:5000/api";

    const fetchSummary = async () => {
        try {
            const res = await axios.get(`${API_BASE}/vendors/pl-summary/${vendorId}`);
            setData(res.data);
            setLoading(false);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchSummary(); }, []);

    const handleAddExpense = async () => {
        if (!expName || !expAmt) return Alert.alert("Error", "Details bhariye");
        try {
            await axios.post(`${API_BASE}/vendors/add-expense`, {
                vendorId, title: expName, amount: Number(expAmt)
            });
            Alert.alert("Success ✅", "Kharcha record ho gaya.");
            setExpName(''); setExpAmt('');
            fetchSummary();
        } catch (err) { Alert.alert("Error", "Add nahi ho paya"); }
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Dhandhe ka Hisaab 📊</Text>

            {/* --- PROFIT/LOSS CARDS --- */}
            <View style={styles.summaryRow}>
                <View style={[styles.card, { backgroundColor: '#E8F5E9', flex: 1 }]}>
                    <Text style={styles.cardLabel}>Kamaai (Income)</Text>
                    <Text style={[styles.cardVal, { color: 'green' }]}>₹{data.totalIncome}</Text>
                </View>
            </View>

            <View style={styles.summaryRow}>
                <View style={[styles.card, { backgroundColor: '#FFEBEE', flex: 1 }]}>
                    <Text style={styles.cardLabel}>Kharcha (Expense)</Text>
                    <Text style={[styles.cardVal, { color: 'red' }]}>₹{data.totalExpense}</Text>
                </View>
            </View>

            <View style={[styles.mainProfit, { backgroundColor: data.netProfit >= 0 ? '#003580' : '#d32f2f' }]}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Net Profit (Asli Munafa)</Text>
                <Text style={styles.profitVal}>₹{data.netProfit}</Text>
            </View>

            {/* --- ADD EXPENSE FORM --- */}
            <View style={styles.formCard}>
                <Text style={styles.formTitle}>Naya Kharcha Jodein</Text>
                <TextInput style={styles.input} placeholder="Kharcha kis liye? (e.g. Rent)" value={expName} onChangeText={setExpName} />
                <TextInput style={styles.input} placeholder="Amount (₹)" keyboardType="numeric" value={expAmt} onChangeText={setExpAmt} />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddExpense}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>RECORD EXPENSE</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    summaryRow: { flexDirection: 'row', marginBottom: 15 },
    card: { padding: 20, borderRadius: 20, elevation: 2 },
    cardLabel: { fontSize: 14, color: '#666' },
    cardVal: { fontSize: 24, fontWeight: 'bold', marginTop: 5 },
    mainProfit: { padding: 30, borderRadius: 25, alignItems: 'center', marginBottom: 30, elevation: 5 },
    profitVal: { color: '#fff', fontSize: 42, fontWeight: '900', marginTop: 5 },
    formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3 },
    formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    input: { borderBottomWidth: 1, borderBottomColor: '#eee', padding: 10, marginBottom: 15, fontSize: 16 },
    addBtn: { backgroundColor: '#003580', padding: 15, borderRadius: 12, alignItems: 'center' }
});