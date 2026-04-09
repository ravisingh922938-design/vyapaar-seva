import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function ComplianceCenter() {
    const { vendorId } = useLocalSearchParams();
    const [selectedService, setSelectedService] = useState('GST Return');
    const [notes, setNotes] = useState('');

    const services = ['GST Return', 'ITR Filing', 'GST Registration', 'Accounting'];

    const handleApply = async () => {
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/tax-service`, {
                vendorId, serviceType: selectedService, notes
            });
            Alert.alert("Success ✅", "CA Team ko aapki request bhej di gayi hai.");
            setNotes('');
        } catch (err) { Alert.alert("Error", "Request fail ho gayi."); }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tax & Compliance 📑</Text>
                <Text style={styles.headerSub}>Returns file karein, penalty se bachein</Text>
            </View>

            <Text style={styles.label}>Service Chunein</Text>
            <View style={styles.serviceRow}>
                {services.map(s => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.chip, selectedService === s && styles.activeChip]}
                        onPress={() => setSelectedService(s)}
                    >
                        <Text style={[styles.chipText, selectedService === s && styles.activeChipText]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Zaroori jankari likhein</Text>
                <TextInput
                    style={styles.textArea}
                    placeholder="Apne business ke baare mein ya tax related koi sawal..."
                    multiline numberOfLines={4}
                    value={notes}
                    onChangeText={setNotes}
                />

                {/* Placeholder for Document Upload */}
                <TouchableOpacity style={styles.uploadBtn} onPress={() => Alert.alert("Upload", "Abhi Documents WhatsApp par bhejein (91xxxx...)")}>
                    <Text style={styles.uploadText}>📁 Upload Documents (PAN/GSTIN)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleApply}>
                    <Text style={styles.submitBtnText}>REQUEST FILING</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.benefitBox}>
                <Text style={styles.benefitTitle}>Vister Tax Benefits:</Text>
                <Text style={styles.benefitText}>• Patna ke expert CAs se advice</Text>
                <Text style={styles.benefitText}>• Market se kam fees</Text>
                <Text style={styles.benefitText}>• 100% Digital process</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
    header: { marginBottom: 30 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: '#003580' },
    headerSub: { fontSize: 14, color: '#666', marginTop: 5 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 15 },
    serviceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
    chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, backgroundColor: '#fff', borderWeight: 1, borderColor: '#ddd' },
    activeChip: { backgroundColor: '#003580', borderColor: '#003580' },
    chipText: { color: '#666', fontSize: 13, fontWeight: 'bold' },
    activeChipText: { color: '#fff' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, shadowColor: '#000', elevation: 3 },
    textArea: { backgroundColor: '#f9f9f9', borderRadius: 15, padding: 15, textAlignVertical: 'top', marginBottom: 20 },
    uploadBtn: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#003580', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
    uploadText: { color: '#003580', fontWeight: 'bold' },
    submitBtn: { backgroundColor: '#28a745', padding: 18, borderRadius: 15, alignItems: 'center' },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    benefitBox: { marginTop: 30, padding: 20, backgroundColor: '#E3F2FD', borderRadius: 15, marginBottom: 50 },
    benefitTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#003580' },
    benefitText: { fontSize: 14, color: '#555', marginBottom: 5 }
});