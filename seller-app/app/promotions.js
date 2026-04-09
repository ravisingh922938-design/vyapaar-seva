import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Promotions() {
    const { vendorId } = useLocalSearchParams();
    const [offers, setOffers] = useState([]);
    const [newOffer, setNewOffer] = useState({ title: '', discount: '', desc: '' });

    const API_BASE = "http://10.243.86.238:5000/api";

    const fetchOffers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/vendors/my-offers/${vendorId}`);
            setOffers(res.data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchOffers(); }, []);

    const handleCreateOffer = async () => {
        if (!newOffer.title || !newOffer.discount) return Alert.alert("Error", "Title aur Discount zaroori hai!");
        try {
            await axios.post(`${API_BASE}/vendors/create-offer`, {
                vendorId, title: newOffer.title, discountValue: newOffer.discount, description: newOffer.desc
            });
            Alert.alert("Mubarak Ho! 🎉", "Aapka offer ab Patna ke grahako ko dikhega.");
            setNewOffer({ title: '', discount: '', desc: '' });
            fetchOffers();
        } catch (err) { Alert.alert("Error", "Offer publish nahi ho paya."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Promotion Manager 📣</Text>

            {/* --- CREATE OFFER FORM --- */}
            <View style={styles.formCard}>
                <Text style={styles.label}>Offer ka Naam (Holi/Diwali Special)</Text>
                <TextInput style={styles.input} value={newOffer.title} onChangeText={(v) => setNewOffer({ ...newOffer, title: v })} placeholder="e.g. Summer Dhamaka" />

                <Text style={styles.label}>Discount (%) ya Price</Text>
                <TextInput style={styles.input} value={newOffer.discount} onChangeText={(v) => setNewOffer({ ...newOffer, discount: v })} placeholder="e.g. 20% OFF" />

                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateOffer}>
                    <Text style={styles.submitText}>LIVE KAREIN (Publish)</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>Aapke Active Offers</Text>

            {/* --- OFFERS LIST --- */}
            {offers.map((item) => (
                <View key={item._id} style={styles.offerCard}>
                    <View style={styles.offerBadge}><Text style={styles.badgeText}>{item.discountValue}</Text></View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.offerTitle}>{item.title}</Text>
                        <Text style={styles.offerStatus}>Status: Live 🟢</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#ff6a00', marginBottom: 20 },
    formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 4, marginBottom: 30 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#666', marginBottom: 5 },
    input: { borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 20, padding: 8, fontSize: 16 },
    submitBtn: { backgroundColor: '#ff6a00', padding: 15, borderRadius: 12, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    offerCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#ff6a00' },
    offerBadge: { backgroundColor: '#fff0e6', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ff6a00' },
    badgeText: { color: '#ff6a00', fontWeight: 'black', fontSize: 14 },
    offerTitle: { fontSize: 16, fontWeight: 'bold' },
    offerStatus: { fontSize: 12, color: 'green', marginTop: 2 }
});