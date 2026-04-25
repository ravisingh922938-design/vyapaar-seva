import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function RechargeWallet() {
    const { vendorId, shop } = useLocalSearchParams();
    const [amount, setAmount] = useState('1000');
    const [loading, setLoading] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false); // New State
    const router = useRouter();
    const API_BASE = "https://api.vister.in/api";

    // --- 🔥 STEP 1: SCRIPT LOADING KO PAKKA KARNA ---
    useEffect(() => {
        if (Platform.OS === 'web') {
            // Check if script already exists
            const existingScript = document.getElementById('razorpay-checkout-js');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'razorpay-checkout-js';
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                script.onload = () => {
                    console.log("✅ Razorpay Script Loaded Successfully");
                    setIsScriptLoaded(true);
                };
                script.onerror = () => {
                    console.log("❌ Razorpay Script Failed to Load");
                };
                document.body.appendChild(script);
            } else {
                setIsScriptLoaded(true);
            }
        }
    }, []);

    const handleRazorpayPayment = async () => {
        // 1. Script Check
        if (Platform.OS === 'web' && (!window.Razorpay || !isScriptLoaded)) {
            alert("Rukiye! Razorpay engine chalu ho raha hai, 2 second baad dobara koshish karein.");
            return;
        }

        if (Number(amount) < 100) {
            alert("Galti: Kam se kam ₹100 dalo!");
            return;
        }

        setLoading(true);
        try {
            // STEP 2: Order ID mangwana
            const orderRes = await axios.post(`${API_BASE}/vendors/recharge/create-order`, {
                amount: Number(amount)
            });

            const { order, key_id } = orderRes.data;

            // STEP 3: Razorpay Popup Config
            const options = {
                key: key_id,
                amount: order.amount,
                currency: order.currency,
                name: "VISTER TECHNOLOGIES",
                description: `Wallet Recharge: ${shop}`,
                order_id: order.id,
                prefill: {
                    name: "Partner",
                    contact: "9229384100"
                },
                theme: { color: "#002D62" },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${API_BASE}/vendors/recharge/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            vendorId: vendorId,
                            amount: amount
                        });

                        if (verifyRes.data.success) {
                            alert("✅ Success! Wallet mein ₹" + amount + " jodd diye gaye hain.");
                            router.replace('/dashboard');
                        }
                    } catch (e) {
                        alert("❌ Verification Failed! Support team ko call karein.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Server Error: Order generate nahi ho raha.");
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
                    placeholder="Min 100"
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
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.payText}>{isScriptLoaded ? 'PROCEED TO PAY' : 'LOADING ENGINE...'}</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.securityBox}>
                <Text style={styles.securityText}>🔒 LIVE MODE | RSA 256 ENCRYPTED</Text>
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
    amtChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f0f2f5', borderWeight: 1, borderColor: '#e0e4e8' },
    amtText: { fontWeight: 'bold', color: '#555', fontSize: 12 },
    payBtn: { backgroundColor: '#28a745', padding: 20, borderRadius: 18, alignItems: 'center' },
    payText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    securityBox: { marginTop: 40, alignItems: 'center' },
    securityText: { color: '#bbb', fontSize: 9, fontWeight: 'bold' }
});