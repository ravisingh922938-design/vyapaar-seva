import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Wallet, ArrowUpRight, Clock } from 'lucide-react-native';

export default function SalesmanWallet() {
    const [balance, setBalance] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>Mera Commission</Text>
                <View style={styles.row}>
                    <Text style={styles.amount}>₹{balance}</Text>
                    <Wallet color="#fff" size={32} />
                </View>
                <Text style={styles.payoutInfo}>Har Monday ko auto-payout hoga</Text>
            </View>

            <View style={styles.infoBox}>
                <Clock size={16} color="#64748b" />
                <Text style={styles.infoText}>Next Payout: Coming Monday</Text>
            </View>

            <TouchableOpacity style={styles.historyBtn}>
                <Text style={styles.btnText}>PURANI EARNINGS DEKHEIN</Text>
                <ArrowUpRight size={16} color="#2563eb" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
    card: { backgroundColor: '#2563eb', borderRadius: 30, padding: 30, elevation: 10 },
    label: { color: '#bfdbfe', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    amount: { color: '#fff', fontSize: 48, fontWeight: '900' },
    payoutInfo: { color: '#fff', fontSize: 10, marginTop: 20, opacity: 0.7, fontStyle: 'italic' },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 30, justifyContent: 'center' },
    infoText: { color: '#64748b', fontWeight: 'bold', fontSize: 13 },
    historyBtn: { marginTop: 20, padding: 20, backgroundColor: '#fff', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWeight: 1, borderColor: '#e2e8f0' },
    btnText: { fontWeight: '900', color: '#1e293b', fontSize: 12 }
});