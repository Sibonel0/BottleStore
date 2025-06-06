// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DailyRevenueScreen from '../screens/DailyRevenueScreen';
import StockScreen from '../screens/StockScreen';
import DamageScreen from '../screens/DamageScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur'; // Use @react-native-community/blur if not on Expo

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#00bfa5',
        tabBarInactiveTintColor: '#555',
        headerShown: false,

        // Floating tab bar styles
        tabBarStyle: styles.floatingTabBar,

        // Blur background for iOS-style glass effect
        tabBarBackground: () => (
          <BlurView tint="dark" intensity={60} style={StyleSheet.absoluteFill} />
        ),

        // Dynamic icons
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Daily Cash') iconName = 'cash-register';
          else if (route.name === 'Stock') iconName = 'cube-outline';
          else if (route.name === 'Damages') iconName = 'close-circle-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Daily Cash" component={DailyRevenueScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Damages" component={DamageScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // fallback if blur fails
    borderRadius: 20,
    height: 60,
    borderTopWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    paddingBottom: Platform.OS === 'android' ? 5 : 20,
    marginHorizontal: 10,
    marginBottom: 25
  },
});
