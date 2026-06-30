import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = 'http://localhost:3000';

const DepositScreen = () => {
  const [amount, setAmount] = useState('10000');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('click');

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      const response = await axios.post(
        `${API_URL}/payments`,
        {
          customerId: user.id,
          amount: parseFloat(amount),
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'completed') {
        Alert.alert('Success', 'Balance added successfully!');
        setAmount('10000');
      } else if (response.data.status === 'pending') {
        Alert.alert('Processing', 'Payment is being processed. Please complete payment in the pop-up.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [10000, 25000, 50000, 100000];

  const paymentMethods = [
    { id: 'click', name: 'Click', icon: 'credit-card' },
    { id: 'payme', name: 'Payme', icon: 'wallet' },
    { id: 'uzum', name: 'Uzum Pay', icon: 'phone-payment' },
    { id: 'cash', name: 'Cash', icon: 'cash' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Amount (UZS)</Text>
        <View style={styles.amountGrid}>
          {presetAmounts.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.amountButton,
                amount === preset.toString() && styles.amountButtonActive,
              ]}
              onPress={() => setAmount(preset.toString())}
            >
              <Text
                style={[
                  styles.amountButtonText,
                  amount === preset.toString() && styles.amountButtonTextActive,
                ]}
              >
                {(preset / 1000).toFixed(0)}K
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethodCard,
              paymentMethod === method.id && styles.paymentMethodCardActive,
            ]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Icon name={method.icon} size={28} color="#00d4ff" />
            <Text style={styles.paymentMethodName}>{method.name}</Text>
            {paymentMethod === method.id && (
              <Icon name="check-circle" size={24} color="#00ff88" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Amount to Add</Text>
        <Text style={styles.summaryAmount}>৳{parseFloat(amount).toLocaleString()}</Text>
        <Text style={styles.summaryMethod}>Method: {paymentMethod.toUpperCase()}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleDeposit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0f0f1e" />
        ) : (
          <>
            <Icon name="check" size={20} color="#0f0f1e" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountButton: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d2d44',
  },
  amountButtonActive: {
    borderColor: '#00d4ff',
    backgroundColor: '#1a3a4a',
  },
  amountButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#aaa',
  },
  amountButtonTextActive: {
    color: '#00d4ff',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2d2d44',
  },
  paymentMethodCardActive: {
    borderColor: '#00d4ff',
    backgroundColor: '#1a3a4a',
  },
  paymentMethodName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginVertical: 8,
  },
  summaryMethod: {
    color: '#666',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#00d4ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0f0f1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DepositScreen;
