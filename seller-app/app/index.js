import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, LogIn, Store } from 'lucide-react-native'; // Icons ke liye

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ LIVE BACKEND URL
  const API_BASE = "https://api.vister.in/api/vendors";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Rukiye!", "Email aur Password dono bharna zaroori hai.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Naya Login Endpoint: /login
      const res = await axios.post(`${API_BASE}/login`, { email, password });

      if (res.data.status === "success") {
        // Token aur Seller Data ko mobile ki memory me save karein
        await AsyncStorage.setItem('sellerToken', res.data.token);
        await AsyncStorage.setItem('sellerData', JSON.stringify(res.data.seller));

        Alert.alert("Swagat Hai!", `Welcome back, ${res.data.seller.shopName}`);

        // Dashboard par bhej do
        router.replace('/dashboard');
      }
    } catch (err) {
      console.log("Login error:", err.response?.data);
      const msg = err.response?.data?.message || "Login fail! Email ya Password check karein.";
      Alert.alert("Galti!", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* BRAND LOGO AREA */}
        <View style={styles.headerArea}>
          <View style={styles.logoIcon}>
            <Store size={40} color="#fff" />
          </View>
          <Text style={styles.title}>VYAPAAR SATHI</Text>
          <Text style={styles.subtitle}>Seller Control Panel</Text>
        </View>

        {/* LOGIN FORM */}
        <View style={styles.card}>
          <View style={styles.inputBox}>
            <Mail size={20} color="#94a3b8" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
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
                <Text style={styles.btnText}>LOGIN NOW</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* REGISTER LINK */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.linkText}>
              Naye Seller hain? <Text style={{ color: '#2563eb', fontWeight: '800' }}>Register Karein</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Powered by Vister Technologies</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f8fafc', padding: 25, justifyContent: 'center' },
  headerArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { backgroundColor: '#2563eb', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 5 },
  title: { fontSize: 28, fontWeight: '900', color: '#1e293b', letterSpacing: -1 },
  subtitle: { fontSize: 12, color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 },
  card: { backgroundColor: '#fff', borderRadius: 30, padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 60 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#334155' },
  button: { width: '100%', height: 65, backgroundColor: '#2563eb', borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  registerLink: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  footerText: { textAlign: 'center', marginTop: 50, fontSize: 10, color: '#cbd5e1', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }
});