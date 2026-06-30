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
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const API_URL = 'http://localhost:3000';

const FoodOrderScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
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

      const response = await axios.get(`${API_URL}/food/menu`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setMenuItems(response.data);
    } catch (error) {
      console.error('Error loading menu:', error);
      Alert.alert('Error', 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((c) => c.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((c) => (c.id === itemId ? { ...c, quantity } : c))
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/food/order`,
        {
          customerId: user.id,
          items: cart.map((item) => ({
            foodMenuId: item.id,
            quantity: item.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Order placed successfully!');
      setCart([]);
      setShowCart(false);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Order failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>৳{item.price}</Text>
      </View>
      {item.description && (
        <Text style={styles.itemDescription}>{item.description}</Text>
      )}
      <View style={styles.itemCategory}>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.stockText}>
          {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.addButton, !item.isAvailable && styles.addButtonDisabled]}
        onPress={() => addToCart(item)}
        disabled={!item.isAvailable}
      >
        <Icon name="plus" size={20} color="#0f0f1e" />
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>৳{item.price} each</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
          <Icon name="minus" size={20} color="#00d4ff" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
          <Icon name="plus" size={20} color="#00d4ff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cartItemTotal}>৳{(item.price * item.quantity).toFixed(0)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />

      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setShowCart(true)}
        >
          <Icon name="shopping-cart" size={24} color="#0f0f1e" />
          <Text style={styles.cartButtonText}>{cart.length} items</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showCart} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shopping Cart</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              style={styles.cartList}
            />

            <View style={styles.cartSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>৳{getTotalPrice().toFixed(0)}</Text>
              </View>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
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
    padding: 8,
    paddingBottom: 80,
  },
  columnWrapper: {
    gap: 8,
  },
  menuItemCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 8,
  },
  itemCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 11,
    color: '#00ff88',
  },
  addButton: {
    backgroundColor: '#00d4ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#0f0f1e',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00d4ff',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  cartButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 12,
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
  cartList: {
    maxHeight: '60%',
    padding: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartItemPrice: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  cartItemTotal: {
    color: '#00d4ff',
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  cartSummary: {
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  summaryValue: {
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#0f0f1e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FoodOrderScreen;
