import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Linking, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function MarketingHub() {
    const { vendorId, shop } = useLocalSearchParams();
    const [customers, setCustomers] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://10.243.86.238:5000/api/vendors/marketing-audience/${vendorId}`)
            .then(res => { setCustomers(res.data); setLoading(false); })
            .catch(err => console.log(err));
    }, []);

    const sendBroadcast = (phone) => {
        const finalMsg = `Hello! This is ${shop}. ${message}`;
        const url = `whatsapp://send?phone=91${phone}&text=${encodeURIComponent(finalMsg)}`;
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Marketing Hub 📢</Text>

            {/* AUDIENCE STATS */}
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>Total Reachable Customers</Text>
                <Text style={styles.statValue}>{customers.length} Grahak</Text>
            </View>

            {/* MESSAGE BOX */}
            <View style={styles.card}>
                <Text style={styles.label}>Broadcast Message</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Aaj humari dukan par 20% ki chhoot hai, zaroor aayein!"
                    multiline numberOfLines={4}
                    value={message}
                    onChangeText={setMessage}
                />
                <Text style={styles.tip}>Tip: Message achha likhein taaki grahak wapas aaye.</Text>
            </View>

            <Text style={styles.subTitle}>Select Customer to Send</Text>

            {customers.map((c, index) => (
                <View key={index} style={styles.custRow}>
                    <View>
                        <Text style={styles.custName}>{c.customerName || "Customer"}</Text>
                        <Text style={styles.custPhone}>{c.customerPhone}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.sendBtn, !message && { backgroundColor: '#ccc' }]}
                        onPress={() => sendBroadcast(c.customerPhone)}
                        disabled={!message}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send WhatsApp</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <View style={{ height: 50 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#6200EE', marginBottom: 20 },
    statCard: { backgroundColor: '#6200EE', padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 20, elevation: 5 },
    statLabel: { color: '#fff', opacity: 0.8, fontSize: 14 },
    statValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 2, marginBottom: 25 },
    label: { fontWeight: 'bold', color: '#444', marginBottom: 10 },
    input: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, textAlignVertical: 'top', borderWeight: 1, borderColor: '#eee' },
    tip: { fontSize: 11, color: '#999', marginTop: 8, fontStyle: 'italic' },
    subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    custRow: { backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    custName: { fontWeight: 'bold', fontSize: 16 },
    custPhone: { color: '#888', fontSize: 12 },
    sendBtn: { backgroundColor: '#25D366', padding: 10, borderRadius: 10 }
});