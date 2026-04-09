import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Ratings() {
    const { vendorId } = useLocalSearchParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://10.243.86.238:5000/api/vendors/reviews/${vendorId}`)
            .then(res => { setData(res.data); setLoading(false); })
            .catch(err => console.log(err));
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} />;

    return (
        <View style={styles.container}>
            {/* 1. OVERALL RATING CARD */}
            <View style={styles.headerCard}>
                <Text style={styles.avgRating}>{data.averageRating}</Text>
                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                <Text style={styles.totalText}>Based on {data.totalReviews} customer reviews</Text>
                <View style={styles.trustBadge}>
                    <Text style={styles.trustText}>✓ Vister Verified Business</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Feedback</Text>

            {/* 2. REVIEWS LIST */}
            <FlatList
                data={data.reviews}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.custName}>{item.customerName}</Text>
                            <Text style={styles.ratingTag}>{item.rating} ★</Text>
                        </View>
                        <Text style={styles.comment}>{item.comment || "No comment provided."}</Text>
                        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Abhi tak koi review nahi mila hai.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
    headerCard: { backgroundColor: '#003580', padding: 30, borderRadius: 25, alignItems: 'center', marginBottom: 25 },
    avgRating: { fontSize: 60, fontWeight: '900', color: '#fff' },
    stars: { fontSize: 20, marginVertical: 5 },
    totalText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    trustBadge: { backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 15 },
    trustText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    reviewCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 2 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    custName: { fontSize: 16, fontWeight: 'bold', color: '#003580' },
    ratingTag: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontWeight: 'bold', fontSize: 12 },
    comment: { color: '#555', marginTop: 8, fontSize: 14, fontStyle: 'italic' },
    date: { color: '#999', fontSize: 11, marginTop: 10 },
    empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});