import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Membership() {
    const { vendorId } = useLocalSearchParams();

    const handlePlanInterest = async (plan) => {
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/upgrade-request`, {
                vendorId, planName: plan
            });
            Alert.alert("Request Received! ✅", `Patna Hub ki team aapko ${plan} plan ke liye call karegi.`);
        } catch (err) { Alert.alert("Error", "Server issues."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Grow Your Business 🚀</Text>
            <Text style={styles.headerSub}>Patna mein apni dukan ko No. 1 banayein</Text>

            {/* 1. GOLD PLAN */}
            <View style={[styles.card, { borderColor: '#FFD700' }]}>
                <View style={styles.planHeader}>
                    <Text style={styles.planName}>GOLD PLAN</Text>
                    <Text style={styles.planPrice}>₹1,999/mo</Text>
                </View>
                <Text style={styles.benefit}>✅ Search mein Top 5 mein aayiye</Text>
                <Text style={styles.benefit}>✅ "Verified" tag milega</Text>
                <Text style={styles.benefit}>✅ 5% discount on Lead Unlocks</Text>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFD700' }]} onPress={() => handlePlanInterest('Gold')}>
                    <Text style={styles.btnText}>I'm Interested</Text>
                </TouchableOpacity>
            </View>

            {/* 2. PLATINUM PLAN */}
            <View style={[styles.card, { borderColor: '#E5E4E2', backgroundColor: '#003580' }]}>
                <View style={styles.planHeader}>
                    <Text style={[styles.planName, { color: '#fff' }]}>PLATINUM</Text>
                    <Text style={[styles.planPrice, { color: '#fff' }]}>₹4,999/mo</Text>
                </View>
                <Text style={[styles.benefit, { color: '#fff' }]}>🔥 Search mein Hamesha No. 1</Text>
                <Text style={[styles.benefit, { color: '#fff' }]}>🔥 "Vister Trust" Badge</Text>
                <Text style={[styles.benefit, { color: '#fff' }]}>🔥 Direct Customer Calls (Unlimited)</Text>
                <Text style={[styles.benefit, { color: '#fff' }]}>🔥 Dedicated Account Manager</Text>
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#fff' }]} onPress={() => handlePlanInterest('Platinum')}>
                    <Text style={[styles.btnText, { color: '#003580' }]}>GO PLATINUM</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Membership Kyon Lein?</Text>
                <Text style={styles.infoText}>Justdial par log hazaron kharch karte hain, hum Patna ke dukaandaron ko kam daam mein zyada grahak dete hain.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: '#003580', textAlign: 'center' },
    headerSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
    card: { backgroundColor: '#fff', borderRadius: 25, padding: 25, marginBottom: 20, borderWidth: 2, elevation: 5 },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    planName: { fontSize: 20, fontWeight: '900', color: '#333' },
    planPrice: { fontSize: 18, fontWeight: 'bold' },
    benefit: { fontSize: 15, marginBottom: 12, color: '#444' },
    btn: { padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 10 },
    btnText: { fontWeight: 'bold', fontSize: 16 },
    infoBox: { marginTop: 20, padding: 20, backgroundColor: '#E3F2FD', borderRadius: 15, marginBottom: 50 },
    infoTitle: { fontWeight: 'bold', fontSize: 16, color: '#003580', marginBottom: 5 },
    infoText: { fontSize: 13, color: '#555', lineHeight: 20 }
});