import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg'; // QR Code generator

export default function BusinessQR() {
    const { vendorId, shop, vendorName } = useLocalSearchParams();

    // Ye URL grahak ko dukaandaar ki profile par le jayega
    const profileUrl = `https://vister.in/vendor/${vendorId}`;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${shop} on Vyapaar Seva! Scan to see services and give ratings: ${profileUrl}`,
            });
        } catch (error) {
            Alert.alert("Error", "Share nahi ho paya.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Aapka Business QR 📲</Text>
            <Text style={styles.subHeader}>Ise apni dukaan par lagayein aur grahako se ratings payein.</Text>

            {/* --- QR CARD --- */}
            <View style={styles.qrCard}>
                <Text style={styles.shopName}>{shop}</Text>
                <Text style={styles.ownerName}>Prop: {vendorName}</Text>

                <View style={styles.qrContainer}>
                    <QRCode
                        value={profileUrl}
                        size={200}
                        color="#003580"
                        backgroundColor="white"
                    />
                </View>

                <View style={styles.brandBox}>
                    <Text style={styles.brandText}>Powered by VYAPAAR SEVA</Text>
                </View>
            </View>

            {/* --- ACTION BUTTONS --- */}
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareText}>Share Digital Card</Text>
            </TouchableOpacity>

            <Text style={styles.tipText}>Tip: Ise screenshot lekar print karwayein aur dukan ke counter par lagayein.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginTop: 20 },
    subHeader: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 10, paddingHorizontal: 20 },
    qrCard: { backgroundColor: '#fff', padding: 30, borderRadius: 25, alignItems: 'center', elevation: 10, marginTop: 20, width: '100%', borderWidth: 2, borderColor: '#003580' },
    shopName: { fontSize: 22, fontWeight: '900', color: '#333', marginBottom: 5, textAlign: 'center' },
    ownerName: { fontSize: 14, color: '#007bff', fontWeight: 'bold', marginBottom: 25 },
    qrContainer: { padding: 15, backgroundColor: '#fff', borderRadius: 15, borderWeight: 1, borderColor: '#eee' },
    brandBox: { marginTop: 25, borderTopWidth: 1, borderTopColor: '#eee', width: '100%', paddingTop: 15, alignItems: 'center' },
    brandText: { fontSize: 12, fontWeight: 'bold', color: '#aaa', letterSpacing: 2 },
    shareBtn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 30 },
    shareText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    tipText: { marginTop: 20, fontSize: 12, color: '#999', fontStyle: 'italic', textAlign: 'center' }
});