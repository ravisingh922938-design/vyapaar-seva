import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function BillingPage() {
    const { vendorId } = useLocalSearchParams();
    const [custName, setCustName] = useState('');
    const [custPhone, setCustPhone] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [items, setItems] = useState([]);
    const router = useRouter();

    const addItem = () => {
        if (!itemName || !itemPrice) return;
        setItems([...items, { name: itemName, price: Number(itemPrice), qty: 1 }]);
        setItemName(''); setItemPrice('');
    };

    const total = items.reduce((acc, curr) => acc + curr.price, 0);

    const handleGenerateBill = async () => {
        if (!custPhone || items.length === 0) return Alert.alert("Error", "Grahak ka number aur items zaroori hain!");
        try {
            await axios.post(`http://10.243.86.238:5000/api/vendors/create-invoice`, {
                vendorId, customerName: custName, customerPhone: custPhone, items, totalAmount: total
            });
            Alert.alert("Success ✅", "Digital Bill ban gaya aur Save ho gaya!");
            router.back();
        } catch (err) { Alert.alert("Error", "Bill save nahi hua"); }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Digital Bill Book 🧾</Text>

            {/* CUSTOMER INFO */}
            <View style={styles.card}>
                <TextInput style={styles.input} placeholder="Customer Name" value={custName} onChangeText={setCustName} />
                <TextInput style={styles.input} placeholder="Customer Phone" keyboardType="phone-pad" maxLength={10} value={custPhone} onChangeText={setCustPhone} />
            </View>

            {/* ADD ITEM SECTION */}
            <View style={styles.card}>
                <Text style={styles.label}>Add Service/Product</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput style={[styles.input, { flex: 2 }]} placeholder="Item (e.g. Gas Repair)" value={itemName} onChangeText={setItemName} />
                    <TextInput style={[styles.input, { flex: 1 }]} placeholder="Price" keyboardType="numeric" value={itemPrice} onChangeText={setItemPrice} />
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Add to List</Text>
                </TouchableOpacity>
            </View>

            {/* ITEMS LIST */}
            <View style={styles.listCard}>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text>{item.name}</Text>
                        <Text>₹{item.price}</Text>
                    </View>
                ))}
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total Amount:</Text>
                    <Text style={styles.totalPrice}>₹{total}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.billBtn} onPress={handleGenerateBill}>
                <Text style={styles.billText}>SAVE & SEND BILL</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
    input: { borderBottomWidth: 1, borderBottomColor: '#eee', padding: 10, marginBottom: 10, fontSize: 16 },
    label: { fontWeight: 'bold', color: '#666', marginBottom: 10 },
    addBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 10, alignItems: 'center' },
    listCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#eee' },
    totalText: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 22, fontWeight: '900', color: '#28a745' },
    billBtn: { backgroundColor: '#003580', padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 50 },
    billText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});