import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, LogIn, Briefcase } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ SALESMAN LOGIN PATH (Live URL)
  const API_BASE = "https://api.vister.in/api/vendors/salesman";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Rukiye!", "Email aur Password bharna zaroori hai.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Email ko lowerCase me convert kiya taaki typo na ho
      const cleanEmail = email.toLowerCase().trim();

      const res = await axios.post(`${API_BASE}/login`, { email: cleanEmail, password });

      if (res.data.status === "success") {
        // Salesman ki ID aur Token dono save karein
        await AsyncStorage.setItem('salesmanId', res.data.salesman.id);
        await AsyncStorage.setItem('salesmanName', res.data.salesman.name);
        await AsyncStorage.setItem('salesmanToken', res.data.token);

        Alert.alert("Welcome!", `Hello ${res.data.salesman.name}`);

        // Seedha Dashboard par bhej do
        router.replace('/dashboard');
      }
    } catch (err) {
      console.log("Login fail:", err.response?.data || err.message);
      const msg = err.response?.data?.message || "Login fail! Email ya Password galat hai.";
      Alert.alert("Galti!", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* SALESMAN LOGO */}
        <View style={styles.headerArea}>
          <View style={styles.logoIcon}>
            <Briefcase size={40} color="#fff" />
          </View>
          <Text style={styles.title}>VYAPAAR SEVA</Text>
          <Text style={styles.subtitle}>Sales Executive Login</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputBox}>
            <Mail size={20} color="#94a3b8" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Official Email"
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
                <Text style={styles.btnText}>ENTER CRM DASHBOARD</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Authorized Vyapaar Seva Personnel Only</Text>
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