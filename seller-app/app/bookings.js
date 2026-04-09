import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Bookings() {
    const { vendorId } = useLocalSearchParams();
    const [list, setList] = useState([]);

    useEffect(() => {
        axios.get(`http://10.243.86.238:5000/api/vendors/my-bookings/${vendorId}`)
            .then(res => setList(res.data));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Appointment Manager 📅</Text>

            <FlatList
                data={list}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.date}>{new Date(item.bookingDate).toDateString()}</Text>
                            <Text style={styles.time}>{item.bookingTime}</Text>
                            <Text style={styles.cust}>{item.customerName}</Text>
                        </View>
                        <View style={styles.statusBox}>
                            <Text style={styles.statusText}>{item.status}</Text>
                            <TouchableOpacity style={styles.confirmBtn}>
                                <Text style={{ color: '#fff', fontSize: 10 }}>CONFIRM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
    date: { fontSize: 12, color: '#007bff', fontWeight: 'bold' },
    time: { fontSize: 18, fontWeight: 'bold', marginVertical: 2 },
    cust: { fontSize: 14, color: '#666' },
    statusBox: { alignItems: 'flex-end' },
    statusText: { fontSize: 10, color: 'orange', fontWeight: 'bold', marginBottom: 10 },
    confirmBtn: { backgroundColor: '#28a745', padding: 8, borderRadius: 5 }
});