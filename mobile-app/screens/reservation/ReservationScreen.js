import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'http://localhost:3000';

const ReservationScreen = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComputer, setSelectedComputer] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState('1');
  const [showModal, setShowModal] = useState(false);
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

      const response = await axios.get(`${API_URL}/computers`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setComputers(response.data);
    } catch (error) {
      console.error('Error loading computers:', error);
      Alert.alert('Error', 'Failed to load computers');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async () => {
    if (!selectedComputer || !duration) {
      Alert.alert('Error', 'Please select computer and duration');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/reservations`,
        {
          customerId: user.id,
          computerId: selectedComputer.id,
          reservedAt: selectedDate,
          durationHours: parseInt(duration),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'PC reserved successfully!');
      setShowModal(false);
      setSelectedComputer(null);
      setDuration('1');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Reservation failed');
    }
  };

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  const renderComputerCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.computerCard,
        selectedComputer?.id === item.id && styles.computerCardSelected,
      ]}
      onPress={() => {
        setSelectedComputer(item);
        setShowModal(true);
      }}
    >
      <View style={styles.computerHeader}>
        <Text style={styles.computerName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'online'
              ? styles.statusOnline
              : styles.statusOffline,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.computerDetail}>Location: {item.location}</Text>
      <Text style={styles.computerDetail}>Rate: ৳{item.hourlyRate}/hour</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={computers}
        renderItem={renderComputerCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reserve: {selectedComputer?.name}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date and Time</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar" size={20} color="#00d4ff" />
                  <Text style={styles.dateText}>
                    {selectedDate.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="datetime"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}

              <View style={styles.formGroup}>
                <Text style={styles.label}>Duration (hours)</Text>
                <View style={styles.durationButtons}>
                  {[1, 2, 3, 4].map((hr) => (
                    <TouchableOpacity
                      key={hr}
                      style={[
                        styles.durationButton,
                        duration === hr.toString() && styles.durationButtonActive,
                      ]}
                      onPress={() => setDuration(hr.toString())}
                    >
                      <Text
                        style={[
                          styles.durationButtonText,
                          duration === hr.toString() &&
                            styles.durationButtonTextActive,
                        ]}
                      >
                        {hr}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.pricePreview}>
                <Text style={styles.priceLabel}>Total:</Text>
                <Text style={styles.priceAmount}>
                  ৳{(selectedComputer?.hourlyRate * parseInt(duration)).toFixed(0)}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
              <Icon name="check" size={20} color="#0f0f1e" style={{ marginRight: 8 }} />
              <Text style={styles.reserveButtonText}>Confirm Reservation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  computerCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2d2d44',
  },
  computerCardSelected: {
    borderColor: '#00d4ff',
  },
  computerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  computerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusOnline: {
    backgroundColor: '#00ff88',
  },
  statusOffline: {
    backgroundColor: '#ff4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  computerDetail: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  dateText: {
    color: '#00d4ff',
    fontSize: 14,
    flex: 1,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2d2d44',
  },
  durationButtonActive: {
    borderColor: '#00d4ff',
  },
  durationButtonText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  durationButtonTextActive: {
    color: '#00d4ff',
  },
  pricePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  priceLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
  },
  reserveButton: {
    backgroundColor: '#00d4ff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reserveButtonText: {
    color: '#0f0f1e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationScreen;
