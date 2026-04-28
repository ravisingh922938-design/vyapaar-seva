import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RechargeWallet() {
    // मंतु भाई, अगर params में ID न मिले तो हम AsyncStorage से उठा लेंगे
    const params = useLocalSearchParams();
    const router = useRouter();
    
    const [amount, setAmount] = useState('1000');
    const [loading, setLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // ✅ १. मंतु भाई, यहाँ LIVE URL डाल दिया है
    const API_BASE = "https://api.vister.in/api";

    useEffect(() => {
        if (Platform.OS === 'web') {
            const existingScript = document.getElementById('razorpay-checkout-js');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'razorpay-checkout-js';
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    console.log("✅ Razorpay Script Loaded");
                    setIsScriptLoaded(true);
                };
                document.body.appendChild(script);
            } else {
                setIsScriptLoaded(true);
            }
        }
    }, []);

    const handleRazorpayPayment = async () => {
        if (!isScriptLoaded || !window.Razorpay) {
            alert("Razorpay इंजन लोड हो रहा है, कृपया २ सेकंड रुकें।");
            return;
        }

        if (Number(amount) < 100) {
            alert("कम से कम ₹100 का रिचार्ज करें।");
            return;
        }

        setLoading(true);
        try {
            // AsyncStorage से सेलर की ID पक्की करें
            const savedData = await AsyncStorage.getItem('sellerData');
            const seller = savedData ? JSON.parse(savedData) : null;
            const finalVendorId = params.vendorId || seller?.id || seller?._id;

            if (!finalVendorId) {
                alert("सेलर की जानकारी नहीं मिली, कृपया दोबारा लॉगिन करें।");
                return;
            }

            // ✅ २. बैकएंड से ऑर्डर आईडी मंगवाना
            const res = await axios.post(`${API_BASE}/vendors/recharge/create-order`, {
                amount: Number(amount),
                vendorId: finalVendorId
            });

            // ✅ ३. डेटा को सही नाम से पढ़ना (जो बैकएंड भेज रहा है)
            if (res.data && res.data.status === "success") {
                const { orderId, amount: orderAmount, keyId } = res.data;

                const options = {
                    key: keyId, 
                    amount: orderAmount, // बैकएंड से पैसे (paise) में आया है
                    currency: "INR",
                    name: "VYAPAAR SEVA",
                    description: "Wallet Recharge",
                    order_id: orderId,
                    prefill: {
                        name: seller?.shopName || "Partner",
                        contact: seller?.phone || ""
                    },
                    theme: { color: "#002D62" },
                    handler: async function (response) {
                        try {
                            // ४. पेमेंट वेरिफिकेशन
                            const verifyRes = await axios.post(`${API_BASE}/vendors/recharge/verify`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                vendorId: finalVendorId,
                                amount: amount // असली रुपया (₹)
                            });

                            if (verifyRes.data.status === "success") {
                                alert("✅ सफल! आपके वॉलेट में ₹" + amount + " जोड़ दिए गए हैं।");
                                router.replace('/dashboard');
                            }
                        } catch (e) {
                            alert("❌ पेमेंट फेल या वेरिफिकेशन एरर।");
                        }
                    },
                    modal: { ondismiss: () => setLoading(false) }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                alert("सर्वर ने सही जवाब नहीं दिया।");
            }

        } catch (err) {
            console.error("Recharge Error:", err.response?.data || err.message);
            alert("Order Generate नहीं हो रहा। अपनी Razorpay Keys चेक करें।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.headerBox}>
                <Text style={styles.header}>Wallet Recharge 💳</Text>
                <Text style={styles.sub}>Vister Secure Live Payment Gateway</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>ENTER RECHARGE AMOUNT (₹)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <View style={styles.quickRow}>
                    {['500', '1000', '2000'].map(amt => (
                        <TouchableOpacity key={amt} style={styles.amtChip} onPress={() => setAmount(amt)}>
                            <Text style={styles.amtText}>₹{amt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.payBtn, { opacity: (loading || !isScriptLoaded) ? 0.6 : 1 }]}
                    onPress={handleRazorpayPayment}
                    disabled={loading || !isScriptLoaded}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.payText}>PROCEED TO PAY</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.securityBox}>
                <Text style={styles.securityText}>🔒 LIVE SECURE MODE | RAZORPAY</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB', padding: 25 },
    headerBox: { alignItems: 'center', marginBottom: 30 },
    header: { fontSize: 26, fontWeight: '900', color: '#002D62' },
    sub: { fontSize: 13, color: '#666', marginTop: 5 },
    card: { backgroundColor: '#fff', padding: 30, borderRadius: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
    label: { fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 15, textAlign: 'center' },
    input: { fontSize: 40, fontWeight: '900', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 25, color: '#002D62', textAlign: 'center' },
    quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30, justifyContent: 'center' },
    amtChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f0f2f5' },
    amtText: { fontWeight: 'bold', color: '#555', fontSize: 12 },
    payBtn: { backgroundColor: '#2563eb', padding: 20, borderRadius: 18, alignItems: 'center' },
    payText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    securityBox: { marginTop: 40, alignItems: 'center' },
    securityText: { color: '#bbb', fontSize: 9, fontWeight: 'bold' }
});