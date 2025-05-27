// screens/LogoutScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🆕 Import AsyncStorage
import HomeScreen from '../screens/HomeScreen';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    // ⚠️ Prompt user for logout confirmation
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => navigation.navigate("HomeScreen"), // ❌ Cancel logs out
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // 🧹 Clear stored user session
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('isLoggedIn')
              await AsyncStorage.removeItem('user')
              // 🔄 Reset navigation stack to LoginScreen
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            } catch (error) {
              console.error('Error clearing AsyncStorage:', error);
              Alert.alert('Logout Failed', 'Could not clear user session.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text style={styles.text}>Preparing logout...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default LogoutScreen;
