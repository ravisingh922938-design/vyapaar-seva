import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Analytics() {
    const { vendorId } = useLocalSearchParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://10.243.86.238:5000/api/vendors/stats/${vendorId}`)
            .then(res => { setStats(res.data); setLoading(false); })
            .catch(err => console.log(err));
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} />;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Business Performance 📈</Text>

            {/* 1. BIG STATS CARDS */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={styles.statLabel}>Profile Views</Text>
                    <Text style={[styles.statValue, { color: '#1976D2' }]}>{stats.views}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={styles.statLabel}>Total Leads</Text>
                    <Text style={[styles.statValue, { color: '#2E7D32' }]}>{stats.leadsPurchased}</Text>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={styles.statLabel}>Customer Calls</Text>
                    <Text style={[styles.statValue, { color: '#EF6C00' }]}>{stats.calls}</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
                    <Text style={styles.statLabel}>Est. Revenue</Text>
                    <Text style={[styles.statValue, { color: '#7B1FA2' }]}>₹{stats.revenueGenerated}</Text>
                </View>
            </View>

            {/* 2. SUMMARY BOX */}
            <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Monthly Summary</Text>
                <Text style={styles.summaryText}>
                    Aapki dukan ko is mahine <Text style={{ fontWeight: 'bold' }}>{stats.views} logon</Text> ne Patna mein dhoondha hai. Aapne <Text style={{ fontWeight: 'bold' }}>{stats.leadsPurchased} grahako</Text> ka data unlock kiya hai.
                </Text>
            </View>

            <Text style={styles.footer}>Vister Technologies Analytics Engine</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 25 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    statCard: { flex: 0.48, padding: 20, borderRadius: 20, elevation: 2, alignItems: 'center' },
    statLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
    statValue: { fontSize: 28, fontWeight: '900', marginTop: 5 },
    summaryBox: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: 10, elevation: 3 },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    summaryText: { fontSize: 15, color: '#555', lineHeight: 22 },
    footer: { textAlign: 'center', marginTop: 40, color: '#aaa', fontSize: 12 }
});