import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Alert, ActivityIndicator, ScrollView, StatusBar, Dimensions, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AppMasterDashboard() {
    const router = useRouter();

    // --- STATES ---
    const [activeTab, setActiveTab] = useState('new');
    const [balance, setBalance] = useState(0);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // सेलर की जानकारी (लॉगिन के बाद यहाँ स्टोर होगी)
    const [seller, setSeller] = useState({
        id: '',
        name: 'Vister Partner',
        shopName: 'Dukan Name',
        area: 'Patna',
        category: ''
    });

    // ✅ लाइव API URL
    const API_BASE = "https://api.vister.in/api";

    // --- १. डेटा लोड करने वाला मुख्य फंक्शन ---
    const loadDashboardData = async () => {
        try {
            // AsyncStorage से डेटा निकालें
            const savedData = await AsyncStorage.getItem('sellerData');
            if (!savedData) {
                router.replace('/'); // अगर डेटा नहीं है तो लॉगिन पर भेजें
                return;
            }

            const parsedSeller = JSON.parse(savedData);
            const sId = parsedSeller.id || parsedSeller._id;
            const catId = parsedSeller.category;

            setSeller({
                id: sId,
                name: parsedSeller.name,
                shopName: parsedSeller.shopName,
                area: parsedSeller.area || 'Bihar',
                category: catId
            });

            // वॉलेट और लीड्स एक साथ मंगाएं
            const [walletRes, leadRes] = await Promise.all([
                axios.get(`${API_BASE}/vendors/wallet/${sId}`),
                axios.get(`${API_BASE}/leads/my-leads/${catId}`)
            ]);

            setBalance(walletRes.data.balance || 0);
            setLeads(leadRes.data.leads || []);

        } catch (err) {
            console.error("Dashboard Load Error:", err.message);
            // Alert.alert("Error", "डेटा अपडेट नहीं हो पाया।");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // पहली बार चलने पर
    useEffect(() => {
        loadDashboardData();
    }, []);

    // Pull to Refresh (नीचे खींचने पर रिफ्रेश)
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadDashboardData();
    }, []);

    // --- २. लीड अनलॉक करने का लॉजिक ---
    const handleUnlock = async (leadId) => {
        Alert.alert(
            "Unlock Lead",
            "क्या आप ₹20 देकर इस ग्राहक का नंबर देखना चाहते हैं?",
            [
                { text: "Nahi", style: "cancel" },
                {
                    text: "Haan",
                    onPress: async () => {
                        try {
                            const res = await axios.post(`${API_BASE}/vendors/unlock-lead`, { 
                                vendorId: seller.id, 
                                leadId 
                            });
                            Alert.alert("✅ सफल", `ग्राहक नंबर: ${res.data.customerPhone}`);
                            loadDashboardData(); // बैलेंस और लिस्ट अपडेट करें
                        } catch (error) {
                            const msg = error.response?.data?.message || "रिचार्ज की ज़रूरत है।";
                            Alert.alert("❌ बैलेंस कम है", msg);
                        }
                    }
                }
            ]
        );
    };

    // --- ३. लॉगआउट लॉजिक ---
    const handleLogout = async () => {
        Alert.alert("Logout", "क्या आप बाहर निकलना चाहते हैं?", [
            { text: "Nahi", style: "cancel" },
            { 
                text: "Logout", 
                style: "destructive",
                onPress: async () => { 
                    await AsyncStorage.clear(); 
                    router.replace('/'); 
                } 
            }
        ]);
    };

    // --- ४. हेल्पर्स (UI Components) ---
    const FeatureBtn = ({ title, icon, lib, path, color }) => {
        const IconLib = lib;
        return (
            <TouchableOpacity 
                style={styles.gridItem} 
                onPress={() => router.push({ pathname: path, params: { vendorId: seller.id } })}
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

            {/* TOP BLUE SECTION */}
            <LinearGradient colors={['#002D62', '#0056b3']} style={styles.topSection}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{seller.shopName?.charAt(0) || 'V'}</Text>
                    </View>
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.shopNameText}>{seller.shopName}</Text>
                        <Text style={styles.areaTag}><Ionicons name="location" size={12} color="#FFD700" /> {seller.area}</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/support')}><Ionicons name="notifications-outline" size={22} color="#fff" /></TouchableOpacity>
                    <TouchableOpacity style={styles.notifBtn} onPress={handleLogout}><Ionicons name="power-outline" size={22} color="#ff4d4d" /></TouchableOpacity>
                </View>
            </LinearGradient>

            {/* WALLET CARD */}
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

            {/* SUPER TOOLS (ALL 16 TOOLS INCLUDED) */}
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

            {/* TAB SELECTION */}
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

    // --- ५. रेंडरिंग ---
    return (
        <View style={styles.mainWrapper}>
            <FlatList
                ListHeaderComponent={renderHeader}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={leads.filter(l => activeTab === 'purchased' ? l.unlockedBy.includes(seller.id) : !l.unlockedBy.includes(seller.id))}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.leadCard}>
                        <View style={styles.leadHeader}>
                            <View style={styles.verifiedBadge}><Text style={styles.verifiedText}>● VERIFIED</Text></View>
                            <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.custName}>{item.customerName}</Text>
                        <Text style={styles.custDesc}>{item.description || "Service request received."}</Text>

                        {activeTab === 'new' ? (
                            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00C853' }]} onPress={() => handleUnlock(item._id)}>
                                <Text style={styles.actionBtnText}>Unlock Contact for ₹20</Text>
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
                ListEmptyComponent={!loading && <Text style={styles.emptyMsg}>Filhaal is category me koi lead nahi hai.</Text>}
                contentContainerStyle={{ paddingBottom: 120 }}
            />

            {/* BOTTOM NAVBAR */}
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
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
                    <Ionicons name="person" size={24} color="#666" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// --- 🎨 STYLES ---
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
    walletCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: -45, borderRadius: 24, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
    walletLabel: { color: '#888', fontSize: 10, fontWeight: 'bold' },
    walletAmount: { color: '#002D62', fontSize: 32, fontWeight: 'bold' },
    passbookText: { color: '#2196F3', fontSize: 11, fontWeight: 'bold', marginTop: 5 },
    rechargeBtn: { borderRadius: 16, overflow: 'hidden' },
    rechargeGrad: { paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
    rechargeBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
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
    leadCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 15, padding: 20, borderRadius: 25, borderLeftWidth: 5, borderLeftColor: '#002D62', elevation: 3 },
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
    emptyMsg: { textAlign: 'center', marginTop: 40, color: '#bbb', fontStyle: 'italic' }
});