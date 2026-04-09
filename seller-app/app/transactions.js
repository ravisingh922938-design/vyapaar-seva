import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Transactions() {
    const { vendorId } = useLocalSearchParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://10.243.86.238:5000/api/vendors/transactions/${vendorId}`)
            .then(res => { setHistory(res.data); setLoading(false); })
            .catch(err => console.log(err));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Passbook / Statement</Text>
            {loading ? <ActivityIndicator size="large" color="#003580" /> : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.desc}>{item.description}</Text>
                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                            </View>
                            <Text style={[styles.amount, { color: item.type === 'credit' ? '#28a745' : '#dc3545' }]}>
                                {item.type === 'credit' ? '+' : '-'} ₹{item.amount}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 15 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#003580' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
    desc: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    date: { fontSize: 12, color: '#999', marginTop: 4 },
    amount: { fontSize: 18, fontWeight: '900' }
});