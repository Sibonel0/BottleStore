import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProfileScreen from './screens/ProfileScreen';
import DailyRevenueScreen from './screens/DailyRevenueScreen.js';
import DamageScreen from './screens/DamageScreen.js';
import StockScreen from './screens/StockScreen.js';
import LogoutScreen from './screens/LogoutScreen';
import PolicyScreen from './screens/PolicyScreen';
import PaymentScreen from './screens/PaymentScreen.js';
import SummaryScreen from './screens/SummaryScreen.js';
import ChatBotScreen from './screens/ChatBotScreen.js';
import RegistrationScreen from './screens/RegistrationScreen';

import LoginScreen from './screens/LoginScreen';
import * as Notifications from 'expo-notifications';
import TabNavigator from './navigation/TabNavigator.js';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('You need to enable notifications in your settings');
  }
};

export default function App() {

  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try{
        const sessionFlag = await AsyncStorage.getItem('isLoggedIn');
        if (sessionFlag === 'true'){
          setInitialRoute('HomeScreen');
        } else{
          setInitialRoute('LoginScreen');
        }
      } catch (error){
        console.error("Error Checking Session", error);
        setInitialRoute('LoginScreen')
      }
    };

    const checkAgreement = async () => {
      const agreed = await AsyncStorage.getItem('termsAgreed')
      setInitialRoute(agreed === 'true'? 'HomeScreen' : 'PolicyScreen');
    }
    requestNotificationPermissions();
    checkAgreement();
    checkSession();
  }, []);

  if (initialRoute === null) return null; // or splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        <Stack.Screen name="HomeScreen" component={TabNavigator} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="ChatBotScreen" component={ChatBotScreen} />
        <Stack.Screen name="DailyCashScreen" component={DailyRevenueScreen} />
        <Stack.Screen name="DamageScreen" component={DamageScreen} />
        <Stack.Screen name="StockScreen" component={StockScreen} />
        <Stack.Screen name="LogoutScreen" component={LogoutScreen} />




      </Stack.Navigator>
    </NavigationContainer>
  );
}
