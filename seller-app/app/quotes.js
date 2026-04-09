import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function SendQuote() {
    const { leadId, vendorId, custName } = useLocalSearchParams();
    const [price, setPrice] = useState('');
    const [msg, setMsg] = useState('Hum best service denge Patna mein.');
    const router = useRouter();

    const handleSend = async () => {
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/send-quote`, {
                vendorId, leadId, price: Number(price), msg
            });
            Alert.alert("Boli Lag Gayi! 🔨", "Grahak ko aapka rate bhej diya gaya hai.");
            router.back();
        } catch (err) { Alert.alert("Error", "Bidding fail ho gayi."); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Bidding Center 🔨</Text>
            <Text style={styles.sub}>Grahak: {custName}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Aapka Rate (Service Charge)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="₹ e.g. 400"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />

                <Text style={styles.label}>Aapka Message (Optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Hum 30 mins mein pahunch jayenge..."
                    value={msg}
                    onChangeText={setMsg}
                />

                <TouchableOpacity style={styles.bidBtn} onPress={handleSend}>
                    <Text style={styles.bidText}>SEND MY QUOTE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 25 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#003580' },
    sub: { fontSize: 16, color: '#666', marginBottom: 30 },
    card: { backgroundColor: '#fff', padding: 25, borderRadius: 25, elevation: 5 },
    label: { fontWeight: 'bold', color: '#444', marginBottom: 10 },
    input: { borderBottomWidth: 2, borderBottomColor: '#003580', padding: 10, fontSize: 18, marginBottom: 25 },
    bidBtn: { backgroundColor: '#FF6A00', padding: 18, borderRadius: 15, alignItems: 'center' },
    bidText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});