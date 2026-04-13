import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
    Linking, ActivityIndicator, RefreshControl, SafeAreaView, Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Phone, MapPin, User, Wallet, Trash2, CheckCircle, PlusCircle, UserCircle, Save } from 'lucide-react-native';

export default function SalesDashboard() {
    const router = useRouter();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('MY_LIST'); // 'POOL' or 'MY_LIST'

    // Notepad ke liye state
    const [activeNote, setActiveNote] = useState({}); // {vendorId: 'text'}

    // ✅ LIVE BACKEND URL
    const API_BASE = "https://api.vister.in/api/vendors";

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const salesmanId = await AsyncStorage.getItem('salesmanId') || "MANTU_SALES_01";

            // Logic: Agar POOL tab hai toh unassigned leads lao, varna apni leads
            const endpoint = activeTab === 'POOL' ? '/available-pool' : `/my-targets/${salesmanId}`;
            const res = await axios.get(`${API_BASE}${endpoint}`);
            setSellers(res.data || []);
        } catch (err) {
            console.log("Data fetch error:", err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // --- 📝 SAVE NOTE LOGIC ---
    const saveNote = async (vendorId) => {
        if (!activeNote[vendorId]) return Alert.alert("Khali note?", "Pehle kuch likho toh!");

        try {
            const salesmanId = await AsyncStorage.getItem('salesmanId') || "MANTU_SALES_01";
            const salesmanName = await AsyncStorage.getItem('salesmanName') || "Sales Executive";

            await axios.post(`${API_BASE}/add-note`, {
                vendorId,
                note: activeNote[vendorId],
                salesmanId,
                salesmanName
            });

            Alert.alert("Saved!", "Aapki baatchit record ho gayi hai.");
            setActiveNote({ ...activeNote, [vendorId]: "" }); // Input clear karein
            fetchData(); // List refresh karein taaki history dikhe
        } catch (e) {
            Alert.alert("Error", "Note save nahi ho paya!");
        }
    };

    // --- 📞 CALL & 🔐 CLAIM & 🔓 RELEASE ---
    const handleCall = (phone) => Linking.openURL(`tel:${phone}`);

    const handleClaim = async (vendorId) => {
        try {
            const salesmanId = await AsyncStorage.getItem('salesmanId') || "MANTU_SALES_01";
            await axios.post(`${API_BASE}/claim-lead`, { vendorId, salesmanId });
            Alert.alert("Success", "Ab ye dukan aapki list me hai!");
            fetchData();
        } catch (e) { Alert.alert("Error", "Bhai, ye lead koi aur claim kar gaya!"); }
    };

    const handleRelease = (vendorId) => {
        Alert.alert("Lead Chhodein?", "Iske baad ye dusre salesman ko dikhne lagega.", [
            { text: "Nahi" },
            {
                text: "Haan, Hatao", onPress: async () => {
                    const salesmanId = await AsyncStorage.getItem('salesmanId') || "MANTU_SALES_01";
                    await axios.post(`${API_BASE}/release-lead`, { vendorId, salesmanId });
                    fetchData();
                }
            }
        ]);
    };

    const renderSeller = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.shopName}>{item.shopName}</Text>
                    <Text style={styles.owner}><User size={12} /> {item.name}</Text>
                </View>

                {activeTab === 'POOL' ? (
                    <TouchableOpacity style={styles.claimBtn} onPress={() => handleClaim(item._id)}>
                        <CheckCircle color="#fff" size={16} />
                        <Text style={styles.btnText}>CLAIM</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item.phone)}>
                        <Phone color="#fff" size={18} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.infoBox}><MapPin size={12} color="#64748b" /><Text style={styles.infoText}>{item.area}</Text></View>
                <View style={styles.infoBox}><Wallet size={12} color="#64748b" /><Text style={styles.infoText}>₹{item.walletBalance}</Text></View>
                {activeTab === 'MY_LIST' && (
                    <TouchableOpacity onPress={() => handleRelease(item._id)}>
                        <Trash2 size={18} color="#ef4444" />
                    </TouchableOpacity>
                )}
            </View>

            {/* --- 📝 NOTEPAD SECTION (Sirf My List me dikhega) --- */}
            {activeTab === 'MY_LIST' && (
                <View style={styles.noteContainer}>
                    {/* Purani History */}
                    {item.salesNotes?.length > 0 && (
                        <View style={styles.historyBox}>
                            <Text style={styles.historyTitle}>LAST TALK:</Text>
                            <Text style={styles.historyText}>{item.salesNotes[item.salesNotes.length - 1].note}</Text>
                        </View>
                    )}

                    {/* Naya Input */}
                    <View style={styles.notepadArea}>
                        <TextInput
                            placeholder="Yahan likhein kya baat hui..."
                            value={activeNote[item._id] || ""}
                            onChangeText={(text) => setActiveNote({ ...activeNote, [item._id]: text })}
                            style={styles.noteInput}
                            multiline
                        />
                        <TouchableOpacity style={styles.saveBtn} onPress={() => saveNote(item._id)}>
                            <Text style={styles.saveBtnText}>SAVE NOTE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => router.push('/profile')}>
                        <UserCircle size={32} color="#2563eb" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Sales CRM</Text>

                    <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-seller')}>
                        <PlusCircle color="#fff" size={18} />
                        <Text style={styles.addBtnText}>ADD</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('MY_LIST')} style={[styles.tab, activeTab === 'MY_LIST' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'MY_LIST' && styles.activeTabText]}>MERI LIST</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('POOL')} style={[styles.tab, activeTab === 'POOL' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'POOL' && styles.activeTabText]}>KHULA POOL</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading && !refreshing ? <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} /> : (
                <FlatList
                    data={sellers}
                    keyExtractor={(item) => item._id}
                    renderItem={renderSeller}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
                    contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>Filhaal koi data nahi hai.</Text>}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingTop: 50 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b' },
    addBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
    addBtnText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#2563eb' },
    tabText: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
    activeTabText: { color: '#fff' },
    card: { backgroundColor: '#fff', borderRadius: 25, padding: 18, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    shopName: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
    owner: { fontSize: 12, color: '#64748b', marginTop: 2 },
    callBtn: { backgroundColor: '#2563eb', width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    claimBtn: { backgroundColor: '#16a34a', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', gap: 5, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
    infoBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    infoText: { fontSize: 12, color: '#475569', fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#94a3b8', fontWeight: 'bold' },

    // --- 📝 NOTEPAD STYLES ---
    noteContainer: { marginTop: 10 },
    notepadArea: {
        marginTop: 10,
        backgroundColor: '#fffbe6',
        padding: 10,
        borderRadius: 15,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#faad14'
    },
    noteInput: { fontSize: 12, color: '#333', minHeight: 40, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: '#faad14', padding: 8, borderRadius: 10, alignSelf: 'flex-end', marginTop: 5 },
    saveBtnText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
    historyBox: { padding: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    historyTitle: { fontSize: 8, fontWeight: 'bold', color: '#94a3b8', marginBottom: 2 },
    historyText: { fontSize: 11, color: '#444', fontStyle: 'italic' }
});