// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../screens/ProfileScreen'; // Optional separate drawer item
import LogoutScreen from '../screens/LogoutScreen';
import PolicyScreen from '../screens/PolicyScreen';
import PaymentScreen from '../screens/PaymentScreen.js';
import SummaryScreen from '../screens/SummaryScreen.js';
import DamageScreen from '../screens/DamageScreen.js';
import StockScreen from '../screens/StockScreen.js';
import DailyRevenueScreen from '../screens/DailyRevenueScreen.js';
import ChatBotScreen from '../screens/ChatBotScreen.js';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: '#111',borderRadius: 40, marginTop: 50, marginBottom: 50,},
        drawerType: 'slide',
        drawerStatusBarAnimation: 'fade',
        drawerActiveTintColor: '#00bfa5',
        drawerInactiveTintColor: '#018786',
        headerShown: false,
        headerTintColor:'#fff',
        headerStyle: {backgroundColor: '#ccc', height: 0},
        headerTitle:""
      }}
      
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{ drawerIcon: ({ color }) => <Icon name="view-dashboard" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="account" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Daily Summary"
        component={SummaryScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="eye-outline" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Policy"
        component={PolicyScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="file-document-outline" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="logout" color={color} size={22} /> }}
      />
       <Drawer.Screen
        name="ChatBot"
        component={ChatBotScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="robot" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ drawerIcon: ({ color }) => <Icon name="logout" color={color} size={22} /> }}
      />
      {/*NOT SHOWN*/}
      <Drawer.Screen
        name="DailyCash"
        component={DailyRevenueScreen}
        options={{ drawerItemStyle: {height: 0},
        drawerLabel: () => null,
        drawerIcon: ({ color }) => <Icon name="cash-register" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Stock"
        component={StockScreen}
        options={{ drawerItemStyle: {height: 0},
        drawerLabel: () => null,
        drawerIcon: ({ color }) => <Icon name="cash-register" color={color} size={22} /> }}
      />
      <Drawer.Screen
        name="Damages"
        component={DamageScreen}
        options={{ drawerItemStyle: {height: 0},
        drawerLabel: () => null,
        drawerIcon: ({ color }) => <Icon name="cash-register" color={color} size={22} /> }}
      />

    </Drawer.Navigator>
  );
}
