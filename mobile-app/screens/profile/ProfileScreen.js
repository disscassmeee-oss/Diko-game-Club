import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  AsyncStorage as RNAsyncStorage,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = 'http://localhost:3000';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      setUser(userData);
      // Load additional stats if needed
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // App will automatically re-render and show login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Icon name="account-circle" size={80} color="#00d4ff" />
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color="#00d4ff" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="email" size={20} color="#00d4ff" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Icon name="wallet" size={32} color="#00ff88" />
            <Text style={styles.statLabel}>Balance</Text>
            <Text style={styles.statValue}>৳{user?.balance?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star" size={32} color="#ffaa00" />
            <Text style={styles.statLabel}>Bonus Points</Text>
            <Text style={styles.statValue}>{user?.bonusPoints || 0}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('History')}
        >
          <Icon name="history" size={20} color="#00d4ff" />
          <Text style={styles.menuItemText}>Purchase History</Text>
          <Icon name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="bell" size={20} color="#00d4ff" />
          <Text style={styles.menuItemText}>Notifications</Text>
          <Icon name="chevron-right" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#0f0f1e" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#00d4ff',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#0f0f1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
