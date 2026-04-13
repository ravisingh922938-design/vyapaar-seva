import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Smartphone, Mail, Award, X, ShieldCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SalesmanProfile() {
    const [salesman, setSalesman] = useState(null);
    const [showID, setShowID] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Dummy Data for testing (Asli data backend se aayega)
        const loadProfile = async () => {
            const data = {
                name: "Mantu Kumar",
                empId: "VS-PAT-001",
                phone: "9229384100",
                email: "mantu@vyapaarseva.com",
                designation: "Senior Sales Partner",
                photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mantu",
                joiningDate: "12 April 2026"
            };
            setSalesman(data);
        };
        loadProfile();
    }, []);

    if (!salesman) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={styles.title}>Mera Profile</Text>

                {/* Profile Info Header */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: salesman.photo }} style={styles.avatar} />
                    <Text style={styles.name}>{salesman.name}</Text>
                    <Text style={styles.designation}>{salesman.designation}</Text>
                </View>

                {/* Details List */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}><User size={18} color="#2563eb" /><Text style={styles.infoText}>ID: {salesman.empId}</Text></View>
                    <View style={styles.infoRow}><Smartphone size={18} color="#2563eb" /><Text style={styles.infoText}>{salesman.phone}</Text></View>
                    <View style={styles.infoRow}><Mail size={18} color="#2563eb" /><Text style={styles.infoText}>{salesman.email}</Text></View>
                </View>

                {/* 🔥 ID CARD BUTTON --- */}
                <TouchableOpacity style={styles.idBtn} onPress={() => setShowID(true)}>
                    <Award color="#fff" size={20} />
                    <Text style={styles.idBtnText}>SHOW DIGITAL ID CARD</Text>
                </TouchableOpacity>

                {/* --- ID CARD MODAL (Trust Builder) --- */}
                <Modal visible={showID} animationType="slide" transparent={true}>
                    <View style={styles.modalBg}>
                        <View style={styles.idCard}>
                            <View style={styles.idHeader}>
                                <Text style={styles.idBrand}>VYAPAAR SEVA</Text>
                                <Text style={styles.idTag}>Official Business Partner</Text>
                            </View>

                            <Image source={{ uri: salesman.photo }} style={styles.idPhoto} />

                            <View style={styles.idBody}>
                                <Text style={styles.idName}>{salesman.name}</Text>
                                <Text style={styles.idRole}>{salesman.designation}</Text>

                                <View style={styles.idDivider} />

                                <Text style={styles.idLabel}>EMPLOYEE ID</Text>
                                <Text style={styles.idVal}>{salesman.empId}</Text>

                                <Text style={styles.idLabel}>VALID FOR</Text>
                                <Text style={styles.idVal}>Patna & Surrounding Areas</Text>

                                <View style={styles.verifiedBadge}>
                                    <ShieldCheck color="#16a34a" size={24} />
                                    <Text style={styles.verifiedText}>VERIFIED EMPLOYEE</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowID(false)}>
                                <X color="#fff" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    title: { fontSize: 28, fontWeight: '900', color: '#1e293b', marginBottom: 20, marginTop: 20 },
    profileHeader: { alignItems: 'center', marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWeight: 3, borderColor: '#2563eb' },
    name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    designation: { color: '#64748b', fontSize: 14, fontWeight: '600' },
    infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
    infoText: { fontSize: 16, fontWeight: '600', color: '#334155' },
    idBtn: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    idBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 1 },

    // ID CARD STYLES
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    idCard: { width: 320, backgroundColor: '#fff', borderRadius: 25, overflow: 'hidden', alignItems: 'center' },
    idHeader: { backgroundColor: '#2563eb', width: '100%', padding: 25, alignItems: 'center' },
    idBrand: { color: '#fff', fontSize: 24, fontWeight: '900', italic: true },
    idTag: { color: '#fff', fontSize: 10, opacity: 0.8, letterSpacing: 1 },
    idPhoto: { width: 120, height: 120, borderRadius: 60, marginTop: -60, backgroundColor: '#fff', borderWidth: 5, borderColor: '#fff' },
    idBody: { padding: 25, alignItems: 'center', width: '100%' },
    idName: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    idRole: { fontSize: 13, color: '#2563eb', fontWeight: '800', marginTop: 3 },
    idDivider: { height: 1, backgroundColor: '#e2e8f0', width: '100%', marginVertical: 15 },
    idLabel: { fontSize: 8, color: '#94a3b8', fontWeight: 'bold' },
    idVal: { fontSize: 14, color: '#334155', fontWeight: 'bold', marginBottom: 10 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
    verifiedText: { color: '#16a34a', fontWeight: 'bold', fontSize: 12 },
    closeBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 5 }
});