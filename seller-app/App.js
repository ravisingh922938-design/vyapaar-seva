import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import api from './api'; // Jo api.js humne banayi thi

export default function App() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (phone.length < 10) {
            Alert.alert("Error", "Sahi mobile number dalo bhai!");
            return;
        }

        setLoading(true);
        try {
            // Hum dukaandaar ko uske phone number se login karwayenge
            // Filhaal hum check kar rahe hain ki vendor registered hai ya nahi
            const response = await api.get('/vendors'); // Saare vendors ki list mangao
            const vendors = response.data;

            const foundVendor = vendors.find(v => v.phone === phone);

            if (foundVendor) {
                Alert.alert("Swagat Hai!", `${foundVendor.name}, Aapka balance ₹${foundVendor.walletBalance} hai.`);
                // Yahan se hum Vendor Dashboard par bhejenge (Agle step mein)
            } else {
                Alert.alert("Galti", "Ye number register nahi hai Patna Hub mein.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Network Error", "Backend se connection nahi ho raha. Check karo server chalu hai?");
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vyapaar Seva</Text>
            <Text style={styles.subtitle}>Seller Login (Patna Hub)</Text>

            <TextInput
                style={styles.input}
                placeholder="Mobile Number (e.g. 9876543210)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </TouchableOpacity>

            <Text style={styles.footer}>Vister Technologies © 2026</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#007bff', marginBottom: 5 },
    subtitle: { fontSize: 18, color: '#555', marginBottom: 40 },
    input: { width: '100%', height: 55, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#ddd', elevation: 2 },
    button: { width: '100%', height: 55, backgroundColor: '#007bff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 5 },
    buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, color: '#aaa' }
});