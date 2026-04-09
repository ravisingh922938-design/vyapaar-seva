import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function ManageCatalog() {
    const { vendorId } = useLocalSearchParams();
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('');
    const [keyword, setKeyword] = useState('');
    const [myKeywords, setMyKeywords] = useState([]);

    const addKeyword = () => {
        if (keyword && !myKeywords.includes(keyword)) {
            setMyKeywords([...myKeywords, keyword.toLowerCase()]);
            setKeyword('');
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://10.243.86.238:5000/api/vendors/update-profile/${vendorId}`, {
                $push: { services: { serviceName, price: Number(price) } },
                $addToSet: { keywords: { $each: myKeywords } }
            });
            Alert.alert("Success! ✅", "Aapka Product/Service list ho gaya.");
        } catch (err) { Alert.alert("Error", "Save nahi ho paya."); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Service Catalog & Keywords 📋</Text>

            {/* 1. KEYWORDS SECTION */}
            <View style={styles.card}>
                <Text style={styles.label}>Search Keywords (Grahak kya search kare?)</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput style={[styles.input, { flex: 1 }]} placeholder="e.g. gas filling" value={keyword} onChangeText={setKeyword} />
                    <TouchableOpacity style={styles.addBtn} onPress={addKeyword}><Text style={{ color: '#fff' }}>ADD</Text></TouchableOpacity>
                </View>
                <View style={styles.tagContainer}>
                    {myKeywords.map((k, i) => (
                        <View key={i} style={styles.tag}><Text style={styles.tagText}>{k} ✕</Text></View>
                    ))}
                </View>
            </View>

            {/* 2. PRODUCT/SERVICE SECTION */}
            <View style={styles.card}>
                <Text style={styles.label}>Add Specific Product/Service</Text>
                <TextInput style={styles.input} placeholder="Service Name (e.g. Split AC Repair)" onChangeText={setServiceName} />
                <TextInput style={styles.input} placeholder="Price (₹)" keyboardType="numeric" onChangeText={setPrice} />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveText}>PUBLISH TO WEBSITE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 3 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#666', marginBottom: 10 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ddd', padding: 8, fontSize: 16, marginBottom: 15 },
    addBtn: { backgroundColor: '#003580', padding: 10, borderRadius: 10, justifyContent: 'center' },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    tag: { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWeight: 1, borderColor: '#003580' },
    tagText: { color: '#003580', fontSize: 12, fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});