import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function LoginScreen() {
  const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP Input
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // BROWSER TESTING KE LIYE LOCALHOST BEST HAI
  const API_URL = "http://api.vister.in/api";

  // --- STEP 1: MOBILE CHECK AUR OTP BHEJNA ---
  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      alert("Kripya 10-digit mobile number dalo!");
      return;
    }

    setLoading(true);
    try {
      // Backend call to send SMS via Fast2SMS
      const res = await axios.post(`${API_URL}/vendors/login-otp`, { phone });
      alert("✅ OTP aapke mobile par bhej diya gaya hai.");
      setStep(2); // OTP screen par le jao
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Dukan register nahi hai ya server busy hai!");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: OTP VERIFY KARKE DASHBOARD PAR JANA ---
  const handleVerifyLogin = async () => {
    if (otp.length < 4) {
      alert("Sahi OTP dalo bhai!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/vendors/verify-login`, { phone, otp });
      const vendor = res.data.vendor;

      if (vendor) {
        alert("🎉 Login Successful!");
        // Dashboard par bhejo saare data ke saath
        router.push({
          pathname: '/dashboard',
          params: {
            vendorId: vendor._id,
            vendorName: vendor.name,
            shop: vendor.shopName,
            area: vendor.area,
            balance: vendor.walletBalance.toString()
          }
        });
      }
    } catch (err) {
      alert("❌ Galat OTP! Terminal mein dekho kya code aaya hai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerBox}>
        <Text style={styles.title}>Vyapaar Seva</Text>
        <Text style={styles.subtitle}>Seller Control Panel</Text>
      </View>

      {/* --- STEP 1: MOBILE NUMBER --- */}
      {step === 1 && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="92293XXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>SEND OTP</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* --- STEP 2: OTP VERIFICATION --- */}
      {step === 2 && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter 4-Digit OTP</Text>
          <TextInput
            style={[styles.input, { textAlign: 'center', fontSize: 32, letterSpacing: 10 }]}
            placeholder="0000"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={4}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: '#28a745' }]} onPress={handleVerifyLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>VERIFY & LOGIN</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 15 }}>
            <Text style={{ color: '#666', textAlign: 'center' }}>Change Number</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerLink}>
          <Text style={styles.registerText}>Naye Seller hain? <Text style={{ fontWeight: 'bold' }}>Register karein</Text></Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footer}>Vister Technologies © 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 25, justifyContent: 'center' },
  headerBox: { alignItems: 'center', marginBottom: 50 },
  title: { fontSize: 36, fontWeight: '900', color: '#002D62' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#888', marginBottom: 10, marginLeft: 5 },
  input: { width: '100%', height: 60, backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 20, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  button: { width: '100%', height: 60, backgroundColor: '#007bff', borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  registerLink: { marginTop: 30, alignItems: 'center' },
  registerText: { color: '#007bff', fontSize: 14 },
  footer: { position: 'absolute', bottom: 30, alignSelf: 'center', color: '#ccc', fontSize: 12 }
});