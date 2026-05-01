import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, LogIn, Store } from 'lucide-react-native';

export default function SellerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ LIVE API BASE
  const API_BASE = "https://api.vister.in/api";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("रुको!", "Email और Password भरना ज़रूरी है।");
      return;
    }

    setLoading(true);
    console.log("🚀 Login shuru ho raha hai...", email);

    try {
      const cleanEmail = email.toLowerCase().trim();

      // ✅ पक्का रस्ता: /vendors/login
      const res = await axios.post(`${API_BASE}/vendors/login`, {
        email: cleanEmail,
        password: password
      });

      console.log("✅ Server ka jawab aaya:", res.data);

      if (res.data.status === "success") {
        // डेटा सुरक्षित सेव करें
        await AsyncStorage.setItem('sellerToken', res.data.token);
        await AsyncStorage.setItem('sellerData', JSON.stringify(res.data.seller));

        console.log("🎯 Dashboard par bhej rahe hain...");
        router.replace('/dashboard'); 
      }
    } catch (err) {
      // ❌ यहाँ असली एरर पकड़ा जाएगा
      console.error("❌ Login Fail Error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Email या Password गलत है।";
      Alert.alert("लॉगिन फेल", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerArea}>
          <View style={styles.logoIcon}>
            <Store size={40} color="#fff" />
          </View>
          <Text style={styles.title}>VYAPAAR SEVA</Text>
          <Text style={styles.subtitle}>Seller Admin Login</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <Mail size={20} color="#94a3b8" />
            <TextInput
              style={styles.input}
              placeholder="Registered Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputBox}>
            <Lock size={20} color="#94a3b8" />
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
        <Text style={styles.footerText}>Authorized Vyapaar Seva Partners Only</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', padding: 25, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { backgroundColor: '#2563eb', padding: 20, borderRadius: 25, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  card: { backgroundColor: '#fff', borderRadius: 30, padding: 25, elevation: 10 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#334155', marginLeft: 10 },
  button: { width: '100%', height: 65, backgroundColor: '#2563eb', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  footerText: { textAlign: 'center', marginTop: 50, fontSize: 10, color: '#475569', fontWeight: 'bold' }
});