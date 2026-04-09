import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function OnlineStore() {
    const { vendorId } = useLocalSearchParams();
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const API_BASE = "http://10.243.86.238:5000/api";

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_BASE}/vendors/my-products/${vendorId}`);
            setProducts(res.data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAdd = async () => {
        try {
            await axios.post(`${API_BASE}/vendors/add-product`, {
                vendorId, name, price: Number(price)
            });
            Alert.alert("Success ✅", "Product Online ho gaya!");
            setName(''); setPrice('');
            fetchProducts();
        } catch (err) { Alert.alert("Error", "Add nahi hua"); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Online Store 🛒</Text>

            {/* ADD PRODUCT FORM */}
            <View style={styles.card}>
                <TextInput style={styles.input} placeholder="Product Name (e.g. Samsung AC)" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Price (₹)" keyboardType="numeric" value={price} onChangeText={setPrice} />
                <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>UPLOAD TO VISTER.IN</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.itemCard}>
                        <View style={styles.imgPlaceholder}><Text>🖼️</Text></View>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 15 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#003580', marginBottom: 15 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3, marginBottom: 20 },
    input: { borderBottomWidth: 1, borderBottomColor: '#eee', padding: 10, marginBottom: 10 },
    addBtn: { backgroundColor: '#003580', padding: 15, borderRadius: 10, alignItems: 'center' },
    itemCard: { flex: 1, backgroundColor: '#fff', margin: 5, padding: 10, borderRadius: 15, alignItems: 'center', elevation: 2 },
    imgPlaceholder: { width: 80, height: 80, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    itemName: { fontSize: 14, fontWeight: 'bold', marginTop: 10 },
    itemPrice: { fontSize: 16, color: 'green', fontWeight: '900' }
});