import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import * as Notifications from 'expo-notifications';
import { BlurView } from 'expo-blur';

const categories = [
  { label: 'EB', value: 'Eswatini Beverages' },
  { label: 'Distell', value: 'Distell' },
  { label: 'SMC', value: 'SMC' },
  { label: 'MassCash', value: 'MassCash' },
];

const StockScreen = () => {
  const [userId, setUserId] = useState('');
  const [category, setCategory] = useState(null);
  const [totalStock, setTotalStock] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem('userID');
        if (storedId) setUserId(storedId);
      } catch (e) {
        console.error('Error fetching userID:', e);
      }
    };

    fetchUserId();
  }, []);

  const validate = () => {
    let valid = true;
    let err = {};

    if (!category) {
      err.category = 'Category required';
      valid = false;
    }
    if (!totalStock) {
      err.totalStock = 'Total stock required';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const saveNotification = async () => {
    await fetch('https://ngogola.onrender.com/api/users/saveNotifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message: `Category: ${category}, Stock: ${totalStock} units.`
      }),
    });
  }

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch('https://ngogola.onrender.com/api/users/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          totalStock: parseFloat(totalStock),
          userId
        }),
      });

      const data = await response.json();

      if (response.ok) {

        Alert.alert('Success', 'Stock saved successfully!');

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Stock Entry Recorded 📦',
            body: `Category: ${category}, Stock: ${totalStock} units.`,
          },
          trigger: null,
        });

        saveNotification(); //SaveNotification
        setCategory(null);
        setTotalStock('');
        setClosingStock('');

      } else {
        Alert.alert('Error', data.message || 'Failed to save');
      }
    } catch (error) {
      
      console.error('Save error:', error);
      Alert.alert('Network Error', 'Could not connect to server');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#f8f8f8', '#000']} style={styles.container}>
        <SafeAreaView style={styles.innerContainer}>
          <Text style={styles.title}>Stock Entry</Text>

          <View style={styles.blurWrapper}>
            <BlurView intensity={45} tint="light" style={styles.blurView}>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              selectedTextStyle={styles.selectedText}
              placeholderStyle={styles.placeholderText}
              data={categories}
              labelField="label"
              valueField="value"
              placeholder="Select category"
              value={category}
              onChange={item => setCategory(item.value)}
            />
            </BlurView>
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={totalStock}
              onChangeText={setTotalStock}
              placeholder="Enter total stock"
            />
            {errors.totalStock && <Text style={styles.errorText}>{errors.totalStock}</Text>}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0066cc" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default StockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginHorizontal: 10,
    height: 55
  },
  blurWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  blurView: {
    borderRadius: 16,
    padding: 1, // slight padding inside BlurView
  },
  dropdown: {
    backgroundColor: 'rgba(230, 217, 217, 0.9)', // Slightly transparent for frosty effect
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    height: 55,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4, // Android shadow
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownContainer: {
    borderRadius: 16,
    backgroundColor: 'rgba(230, 217, 217, 0.9)', // translucent glass-like    shadowColor: '#000',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(230, 217, 217, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 80,
    marginTop: 60,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'crimson',
    marginTop: 5,
    marginHorizontal: 10,
  },
});
