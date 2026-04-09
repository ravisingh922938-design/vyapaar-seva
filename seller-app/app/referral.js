import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ReferralProgram() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Safety Check: Agar vendorId nahi mili toh crash nahi hoga
    const vendorId = params.vendorId || "";
    const vendorName = params.vendorName || "Partner";

    // Slice tabhi chalega jab vendorId maujood ho
    const myCode = vendorId
        ? "VISTER" + vendorId.slice(-5).toUpperCase()
        : "VISTER-NEW";

    const onShare = async () => {
        try {
            await Share.share({
                message: `Bhai, Patna Hub (Vyapaar Seva) app join kar! Mera referral code use kar: ${myCode}. Link: http://localhost:3000/register`,
            });
        } catch (error) { console.log(error); }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 20 }}>
                <Text style={{ color: '#003580', fontWeight: 'bold' }}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.heroBox}>
                <Text style={styles.giftIcon}>🎁</Text>
                <Text style={styles.heroTitle}>Muft Balance Kamayein!</Text>
                <Text style={styles.heroSub}>Apne dukaandaar doston ko jodein aur ₹100 payein.</Text>
            </View>

            <View style={styles.codeCard}>
                <Text style={styles.label}>Aapka Referral Code</Text>
                <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{myCode}</Text>
                </View>

                <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
                    <Text style={styles.shareBtnText}>WhatsApp par Share karein</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.stepCard}>
                <Text style={styles.stepTitle}>Kaise kaam karta hai?</Text>
                <Text style={styles.stepText}>1. Dost ko app link aur code bhejein.</Text>
                <Text style={styles.stepText}>2. Wo register karte waqt aapka code dalega.</Text>
                <Text style={styles.stepText}>3. Aapko ₹100 ka instant balance milega!</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F7FA', padding: 20 },
    heroBox: { alignItems: 'center', marginVertical: 20 },
    giftIcon: { fontSize: 80, marginBottom: 10 },
    heroTitle: { fontSize: 24, fontWeight: '900', color: '#003580' },
    heroSub: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 5 },
    codeCard: { backgroundColor: '#fff', padding: 30, borderRadius: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 10 },
    codeBox: { backgroundColor: '#E3F2FD', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, borderColor: '#003580' },
    codeText: { fontSize: 28, fontWeight: 'bold', color: '#003580', letterSpacing: 2 },
    shareBtn: { backgroundColor: '#25D366', padding: 18, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 30 },
    shareBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    stepCard: { marginTop: 30, padding: 10 },
    stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    stepText: { fontSize: 14, color: '#555', marginBottom: 10 }
});