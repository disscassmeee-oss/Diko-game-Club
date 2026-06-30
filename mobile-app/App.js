import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/home/HomeScreen';
import DepositScreen from './screens/deposit/DepositScreen';
import ReservationScreen from './screens/reservation/ReservationScreen';
import FoodOrderScreen from './screens/food/FoodOrderScreen';
import HistoryScreen from './screens/history/HistoryScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const HomeTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { color: '#ffffff' },
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
};

const DepositTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { color: '#ffffff' },
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="DepositMain" component={DepositScreen} options={{ title: 'Add Balance' }} />
    </Stack.Navigator>
  );
};

const ReservationTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { color: '#ffffff' },
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="ReservationMain" component={ReservationScreen} options={{ title: 'Reserve PC' }} />
    </Stack.Navigator>
  );
};

const FoodTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { color: '#ffffff' },
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="FoodMain" component={FoodOrderScreen} options={{ title: 'Food & Drinks' }} />
    </Stack.Navigator>
  );
};

const ProfileTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#00d4ff',
        headerTitleStyle: { color: '#ffffff' },
        cardStyle: { backgroundColor: '#0f0f1e' },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Purchase History' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
    </Stack.Navigator>
  );
};

const AppTabNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2d2d44',
          borderTopWidth: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'DepositTab') {
            iconName = focused ? 'wallet-plus' : 'wallet-plus-outline';
          } else if (route.name === 'ReservationTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'FoodTab') {
            iconName = focused ? 'food' : 'food-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeTabStack} options={{ title: 'Home' }} />
      <Tab.Screen name="DepositTab" component={DepositTabStack} options={{ title: 'Deposit' }} />
      <Tab.Screen name="ReservationTab" component={ReservationTabStack} options={{ title: 'Reserve' }} />
      <Tab.Screen name="FoodTab" component={FoodTabStack} options={{ title: 'Food' }} />
      <Tab.Screen name="ProfileTab" component={ProfileTabStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
