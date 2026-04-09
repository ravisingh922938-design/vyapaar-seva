import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function LeadTracker() {
    const { vendorId } = useLocalSearchParams();
    const [myLeads, setMyLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [status, setStatus] = useState('');

    const API_BASE = "http://10.243.86.238:5000/api";

    useEffect(() => {
        fetchMyLeads();
    }, []);

    const fetchMyLeads = async () => {
        const res = await axios.get(`${API_BASE}/vendors/tracked-leads/${vendorId}`);
        setMyLeads(res.data);
    };

    const handleUpdate = async () => {
        try {
            await axios.post(`${API_BASE}/vendors/update-lead-status`, {
                vendorId, leadId: selectedLead, status
            });
            Alert.alert("Success", "Status updated!");
            setModalVisible(false);
            fetchMyLeads();
        } catch (err) { console.log(err); }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Work Tracker ✅</Text>

            <FlatList
                data={myLeads}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.name}>{item.leadId?.customerName}</Text>
                            <Text style={[styles.status, { color: item.status === 'Deal Closed' ? 'green' : 'orange' }]}>
                                Current Status: {item.status}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.updateBtn}
                            onPress={() => { setSelectedLead(item.leadId?._id); setModalVisible(true); }}
                        >
                            <Text style={styles.btnText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* UPDATE STATUS MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <div style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Set Lead Status</Text>
                        {['Spoke to Customer', 'Meeting Fixed', 'Deal Closed', 'Not Interested'].map(s => (
                            <TouchableOpacity key={s} style={styles.statusOption} onPress={() => setStatus(s)}>
                                <Text style={{ color: status === s ? '#003580' : '#666', fontWeight: 'bold' }}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>SAVE CHANGES</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ marginTop: 15, color: 'red' }}>Cancel</Text></TouchableOpacity>
                    </View>
                </div>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    header: { fontSize: 22, fontWeight: 'bold', color: '#003580', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
    name: { fontSize: 16, fontWeight: 'bold' },
    status: { fontSize: 12, marginTop: 5 },
    updateBtn: { bg: '#003580', padding: 8, borderRadius: 5, backgroundColor: '#003580' },
    btnText: { color: '#fff', fontSize: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', p: 30, borderRadius: 20, width: '80%', padding: 25, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    statusOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', width: '100%', alignItems: 'center' },
    saveBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 20 }
});