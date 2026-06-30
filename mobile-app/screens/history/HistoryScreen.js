import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = 'http://localhost:3000';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      setToken(authToken);
      setUser(userData);

      const response = await axios.get(
        `${API_URL}/billing/customer/${userData.id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="history" size={60} color="#666" />
          <Text style={styles.emptyText}>No purchase history</Text>
        </View>
      </View>
    );
  }

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Session</Text>
          <Text style={styles.cardSubtitle}>{item.computerId}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'paid'
              ? styles.statusPaid
              : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Icon name="clock" size={16} color="#aaa" />
          <Text style={styles.detailText}>{item.duration} minutes</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="credit-card" size={16} color="#aaa" />
          <Text style={styles.detailText}>৳{item.amount}</Text>
        </View>
      </View>

      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 12,
  },
  historyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#aaa',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPaid: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  statusPending: {
    backgroundColor: 'rgba(255, 170, 0, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  cardDetails: {
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  detailText: {
    color: '#aaa',
    fontSize: 13,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
});

export default HistoryScreen;
