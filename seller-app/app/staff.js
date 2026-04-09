import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function StaffManagement() {
    const { vendorId } = useLocalSearchParams();
    const [staffList, setStaffList] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const API_BASE = "http://10.243.86.238:5000/api";

    const fetchStaff = async () => {
        try {
            const res = await axios.get(`${API_BASE}/vendors/my-staff/${vendorId}`);
            setStaffList(res.data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleAddStaff = async () => {
        if (!newName || !newPhone) return Alert.alert("Galti", "Naam aur Number bhariye");
        try {
            await axios.post(`${API_BASE}/vendors/add-staff`, {
                vendorId, name: newName, phone: newPhone
            });
            Alert.alert("Success ✅", "Naya staff member jud gaya!");
            setNewName(''); setNewPhone('');
            fetchStaff();
        } catch (err) { Alert.alert("Error", "Staff add nahi ho paya"); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Team Management 👥</Text>

            {/* ADD STAFF FORM */}
            <View style={styles.card}>
                <Text style={styles.label}>Naya Staff Jodein</Text>
                <TextInput style={styles.input} placeholder="Worker ka Naam" value={newName} onChangeText={setNewName} />
                <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" maxLength={10} value={newPhone} onChangeText={setNewPhone} />
                <TouchableOpacity style={styles.addBtn} onPress={handleAddStaff}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ ADD TO TEAM</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subTitle}>Aapki Team ({staffList.length})</Text>

            <FlatList
                data={staffList}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.staffCard}>
                        <View>
                            <Text style={styles.staffName}>{item.name}</Text>
                            <Text style={styles.staffRole}>{item.role} • {item.phone}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Available' ? '#E8F5E9' : '#FFF3E0' }]}>
                            <Text style={{ color: item.status === 'Available' ? 'green' : 'orange', fontSize: 10, fontWeight: 'bold' }}>{item.status}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
    header: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3, marginBottom: 25 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 10 },
    input: { borderBottomWidth: 1, borderBottomColor: '#eee', padding: 10, marginBottom: 15, fontSize: 16 },
    addBtn: { backgroundColor: '#003580', padding: 15, borderRadius: 12, alignItems: 'center' },
    subTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    staffCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#003580' },
    staffName: { fontSize: 16, fontWeight: 'bold' },
    staffRole: { fontSize: 12, color: '#999', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }
});