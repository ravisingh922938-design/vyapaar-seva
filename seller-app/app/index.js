import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, LogIn, Store } from 'lucide-react-native'; // Briefcase की जगह Store लगाया है

export default function SellerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ SELLER LOGIN PATH (अब यह सीधा वेंडर लॉगिन पर जाएगा)
  const API_BASE = "https://api.vister.in/api/vendors";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("रुको!", "ईमेल और पासवर्ड भरना ज़रूरी है।");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();

      // 🔥 सुधार: अब ये /login पर जाएगा, /salesman/login पर नहीं
      const res = await axios.post(`${API_BASE}/login`, { 
        email: cleanEmail, 
        password 
      });

      if (res.data.status === "success") {
        // ✅ वेंडर का डेटा और टोकन सेव करें
        await AsyncStorage.setItem('sellerToken', res.data.token);
        await AsyncStorage.setItem('sellerData', JSON.stringify(res.data.seller));

        Alert.alert("सफल!", `स्वागत है ${res.data.seller.shopName}`);

        // डैशबोर्ड पर भेजें
        router.replace('/dashboard');
      }
    } catch (err) {
      console.log("Login fail:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "लॉगिन फेल! कृपया ईमेल और पासवर्ड चेक करें।";
      Alert.alert("गड़बड़!", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* SELLER LOGO SECTION */}
        <View style={styles.headerArea}>
          <View style={styles.logoIcon}>
            <Store size={40} color="#fff" />
          </View>
          <Text style={styles.title}>VYAPAAR SEVA</Text>
          <Text style={styles.subtitle}>Seller Admin Login</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <Mail size={20} color="#94a3b8" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Seller Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputBox}>
            <Lock size={20} color="#94a3b8" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LogIn size={20} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.btnText}>ENTER SELLER DASHBOARD</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Authorized Seller Personnel Only</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', padding: 25, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { backgroundColor: '#2563eb', padding: 20, borderRadius: 25, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  subtitle: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  card: { backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 10 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#334155' },
  button: { width: '100%', height: 65, backgroundColor: '#2563eb', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  footerText: { textAlign: 'center', marginTop: 50, fontSize: 10, color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }
});