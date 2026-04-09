import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function AppMasterDashboard() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const VENDOR_ID = params.vendorId || "69ce13032320d8c2c0ea99c6";
    const { vendorName, shop, area } = params;

    const [activeTab, setActiveTab] = useState('new');
    const [balance, setBalance] = useState(0);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ SAHI IP ADDRESS (Aapke ipconfig ke anusar)
    const API_BASE = "http://10.44.111.238:5000/api";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const vRes = await axios.get(`${API_BASE}/vendors/wallet/${VENDOR_ID}`);
            setBalance(vRes.data.walletBalance);
            const lRes = await axios.get(`${API_BASE}/leads`);
            setLeads(lRes.data);
        } catch (err) {
            console.log("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (leadId) => {
        try {
            const res = await axios.post(`${API_BASE}/vendors/unlock-lead`, { vendorId: VENDOR_ID, leadId });
            Alert.alert("✅ Lead Unlocked", `Grahak ka Number: ${res.data.customerPhone}`);
            fetchData(); // Balance update karne ke liye
        } catch (error) {
            Alert.alert("❌ Low Balance", "Kripya apna wallet recharge karein.");
        }
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Kya aap bahar nikalna chahte hain?", [
            { text: "Nahi" },
            { text: "Logout", onPress: () => router.replace('/') }
        ]);
    };

    // --- REUSABLE FEATURE BUTTON ---
    const FeatureBtn = ({ title, icon, lib, path, color }) => {
        const IconLib = lib;
        return (
            <TouchableOpacity
                style={styles.gridItem}
                onPress={() => router.push({ pathname: path, params: { vendorId: VENDOR_ID, shop, vendorName, area } })}
            >
                <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
                    <IconLib name={icon} size={22} color={color} />
                </View>
                <Text style={styles.gridLabel}>{title}</Text>
            </TouchableOpacity>
        );
    };

    const renderHeader = () => (
        <View style={{ backgroundColor: '#F8F9FB' }}>
            <StatusBar barStyle="light-content" />

            {/* 1. TOP PREMIUM HEADER */}
            <LinearGradient colors={['#002D62', '#0056b3']} style={styles.topSection}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatar}>
                        <Text style={styles.avatarText}>{vendorName?.charAt(0) || 'V'}</Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.shopNameText}>{shop || "Vister Partner"}</Text>
                        <Text style={styles.areaTag}><Ionicons name="location" size={12} color="#FFD700" /> {area || "Patna"}</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/support')}><Ionicons name="notifications-outline" size={24} color="#fff" /></TouchableOpacity>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/profile')}><Ionicons name="settings-outline" size={24} color="#fff" /></TouchableOpacity>
                </View>
            </LinearGradient>

            {/* 2. WALLET CARD */}
            <View style={styles.walletCard}>
                <View>
                    <Text style={styles.walletLabel}>CURRENT BALANCE</Text>
                    <Text style={styles.walletAmount}>₹{balance}</Text>
                    <TouchableOpacity onPress={() => router.push('/transactions')}>
                        <Text style={styles.passbookText}>💳 Passbook History ›</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.rechargeBtn} onPress={() => router.push('/recharge')}>
                    <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.rechargeGrad}>
                        <Ionicons name="add-circle" size={18} color="white" />
                        <Text style={styles.rechargeBtnText}>RECHARGE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* 3. PROMO BANNERS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
                <TouchableOpacity style={[styles.banner, { backgroundColor: '#FFF9C4', borderLeftColor: '#FBC02D' }]} onPress={() => router.push('/membership')}>
                    <MaterialCommunityIcons name="rocket-launch" size={26} color="#F57C00" />
                    <Text style={styles.bannerTitle}>GO PLATINUM</Text>
                    <Text style={styles.bannerSub}>Get 10x more leads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.banner, { backgroundColor: '#E0E7FF', borderLeftColor: '#4F46E5' }]} onPress={() => router.push('/referral')}>
                    <Ionicons name="gift" size={26} color="#4F46E5" />
                    <Text style={[styles.bannerTitle, { color: '#4F46E5' }]}>EARN ₹100</Text>
                    <Text style={[styles.bannerSub, { color: '#4F46E5' }]}>Refer another Seller</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* 4. MAIN TOOLS GRID (ALL 23 FEATURES) */}
            <View style={styles.whiteBox}>
                <Text style={styles.sectionTitle}>Business Super Tools</Text>
                <View style={styles.grid}>
                    <FeatureBtn title="Verified" icon="verified-user" lib={MaterialIcons} path="/kyc" color="#4CAF50" />
                    <FeatureBtn title="Stats" icon="bar-chart" lib={Ionicons} path="/analytics" color="#2196F3" />
                    <FeatureBtn title="Hisaab" icon="calculator" lib={FontAwesome5} path="/finance" color="#E91E63" />
                    <FeatureBtn title="Reviews" icon="stars" lib={MaterialIcons} path="/reviews" color="#FF9800" />
                    <FeatureBtn title="Catalog" icon="inventory" lib={MaterialIcons} path="/catalog" color="#FF5722" />
                    <FeatureBtn title="QR Code" icon="qr-code-scanner" lib={MaterialIcons} path="/qrcode" color="#673AB7" />
                    <FeatureBtn title="Offers" icon="local-offer" lib={MaterialIcons} path="/promotions" color="#f44336" />
                    <FeatureBtn title="Bidding" icon="gavel" lib={FontAwesome5} path="/quotes" color="#795548" />
                    <FeatureBtn title="Store" icon="storefront" lib={MaterialIcons} path="/store" color="#009688" />
                    <FeatureBtn title="GST/Tax" icon="description" lib={MaterialIcons} path="/compliance" color="#607D8B" />
                    <FeatureBtn title="Bill Book" icon="receipt-long" lib={MaterialIcons} path="/billing" color="#3F51B5" />
                    <FeatureBtn title="My Team" icon="group" lib={MaterialIcons} path="/staff" color="#fb8c00" />
                    <FeatureBtn title="Broadcast" icon="send" lib={MaterialIcons} path="/marketing" color="#6200EE" />
                    <FeatureBtn title="Bookings" icon="event-available" lib={MaterialIcons} path="/bookings" color="#00cccc" />
                    <FeatureBtn title="Warranty" icon="security" lib={MaterialIcons} path="/warranty" color="#ff5252" />
                    <FeatureBtn title="Tracker" icon="assignment-turned-in" lib={MaterialIcons} path="/leadtracker" color="#ffa000" />
                </View>
            </View>

            {/* 5. LEADS TAB */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tab, activeTab === 'new' && styles.activeTab]} onPress={() => setActiveTab('new')}>
                    <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>Naye Grahak</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, activeTab === 'purchased' && styles.activeTab]} onPress={() => setActiveTab('purchased')}>
                    <Text style={[styles.tabText, activeTab === 'purchased' && styles.activeTabText]}>My Leads</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.mainWrapper}>
            <FlatList
                ListHeaderComponent={renderHeader}
                data={leads.filter(l => activeTab === 'purchased' ? l.unlockedBy.includes(VENDOR_ID) : !l.unlockedBy.includes(VENDOR_ID))}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.leadCard}>
                        <View style={styles.leadHeader}>
                            <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>● VERIFIED</Text></View>
                            <Text style={styles.timeText}>{activeTab === 'new' ? 'Just Now' : 'Purchased'}</Text>
                        </View>
                        <Text style={styles.custName}>{item.customerName}</Text>
                        <Text style={styles.custDesc}>{item.description}</Text>

                        {/* 🔥 FIXED LOGIC FOR BUTTONS */}
                        {activeTab === 'new' ? (
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: '#00C853' }]}
                                onPress={() => handleUnlock(item._id)}
                            >
                                <Text style={styles.actionBtnText}>Unlock for ₹20</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: '#002D62' }]}
                                onPress={() => Alert.alert("Calling...", `Connecting to ${item.customerPhone}`)}
                            >
                                <Text style={styles.actionBtnText}>📞 Call {item.customerPhone}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMsg}>Filhaal koi lead nahi hai.</Text>}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* --- BOTTOM NAVBAR --- */}
            <View style={styles.navbar}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/dashboard')}>
                    <Ionicons name="home" size={24} color="#002D62" />
                    <Text style={[styles.navText, { color: '#002D62' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('new')}>
                    <MaterialCommunityIcons name="flash" size={24} color="#666" />
                    <Text style={styles.navText}>Leads</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/recharge')}>
                    <Ionicons name="wallet" size={24} color="#666" />
                    <Text style={styles.navText}>Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
                    <Ionicons name="power" size={24} color="#f44336" />
                    <Text style={[styles.navText, { color: '#f44336' }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: { flex: 1, backgroundColor: '#F8F9FB' },
    topSection: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 70, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    userInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    shopNameText: { color: '#fff', fontSize: 18, fontWeight: '900' },
    areaTag: { color: '#FFD700', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
    headerIcons: { flexDirection: 'row', gap: 15 },
    notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },

    walletCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: -45, borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
    walletLabel: { color: '#888', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    walletAmount: { color: '#002D62', fontSize: 32, fontWeight: 'bold' },
    passbookText: { color: '#2196F3', fontSize: 11, fontWeight: 'bold', marginTop: 5 },
    rechargeBtn: { borderRadius: 16, overflow: 'hidden', elevation: 5 },
    rechargeGrad: { paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
    rechargeBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },

    bannerScroll: { paddingLeft: 20, marginTop: 20 },
    banner: { width: 200, padding: 15, borderRadius: 20, marginRight: 12, borderLeftWidth: 5, justifyContent: 'center' },
    bannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#856404' },
    bannerSub: { fontSize: 10, color: '#856404', opacity: 0.7 },

    whiteBox: { backgroundColor: 'white', marginTop: 20, marginHorizontal: 20, borderRadius: 30, padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: { width: '23%', alignItems: 'center', marginBottom: 20 },
    iconCircle: { width: 50, height: 50, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    gridLabel: { fontSize: 9, color: '#444', fontWeight: 'bold', marginTop: 8, textAlign: 'center' },

    tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, backgroundColor: '#EDF2F7', borderRadius: 15, padding: 5 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    activeTab: { backgroundColor: 'white', elevation: 3 },
    tabText: { fontSize: 13, color: '#718096', fontWeight: 'bold' },
    activeTabText: { color: '#002D62' },

    leadCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 15, padding: 20, borderRadius: 25, elevation: 3, borderLeftWidth: 1, borderLeftColor: '#eee' },
    leadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    verifiedBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
    verifiedText: { color: '#4CAF50', fontSize: 9, fontWeight: 'bold' },
    timeText: { color: '#BBB', fontSize: 10 },
    custName: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
    custDesc: { fontSize: 13, color: '#718096', marginVertical: 10 },
    actionBtn: { padding: 15, borderRadius: 15, alignItems: 'center' },
    actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

    navbar: { flexDirection: 'row', backgroundColor: '#fff', position: 'absolute', bottom: 0, width: '100%', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEE', justifyContent: 'space-around', elevation: 20 },
    navItem: { alignItems: 'center' },
    navText: { fontSize: 10, marginTop: 4, fontWeight: 'bold', color: '#666' },
    emptyMsg: { textAlign: 'center', marginTop: 40, color: '#bbb' }
});