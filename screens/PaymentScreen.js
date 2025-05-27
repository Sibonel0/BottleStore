import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

const categories = [
  {label: 'MoMo',  value: 'Mobile Money'},
  {label: 'Card', value: 'Credit/Debit'}
]

export default function PaymentScreen() {
  // States
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState(null);
  const [category, setCategory] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Additional fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID');
        if (storedUserID) {
          setUserID(storedUserID);
        } else {
          Alert.alert("User not found", "Please log in again.");
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0); // Reset for next switch
      });
    };
    loadUserData();
  }, [method]);

  // Payment validation + mock API
  const handlePayment = async () => {
    const numericAmount = parseFloat(amount);

    // Validate amount
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Validation Error', 'Enter a valid amount greater than 0.');
      return;
    }

    // Validate method
    if (!method) {
      Alert.alert('Validation Error', 'Please select a payment method.');
      return;
    }

    if (!category) {
      Alert.alert('Enter Category')
      return;
    }

    // Validate card fields
    if (method === 'card') {
      if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        Alert.alert('Validation Error', 'Card number must be 16 digits.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        Alert.alert('Validation Error', 'Expiry must be in MM/YY format.');
        return;
      }
      if (cvv.length !== 3 || isNaN(cvv)) {
        Alert.alert('Validation Error', 'CVV must be 3 digits.');
        return;
      }
    }

    // Validate mobile money fields
    if (method === 'mobile_money') {
      const cellRegex = /^\+?([0-9]{1,3})?([0-9]{8})$/;
      if (cellRegex.test(mobileNumber)) {
        Alert.alert('Enter a valid mobile number.');
        return;
      }
    }

    // All passed — proceed
    setLoading(true);

    try {
      const response = await fetch('https://mockapi.io/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          amount: numericAmount,
          method,
          card: method === 'card' ? { cardNumber, expiry, cvv } : null,
          mobile: method === 'mobile_money' ? { mobileNumber } : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Payment Success', `Transaction ID: ${data.transactionId || 'N/A'}`);
      } else {
        Alert.alert('Payment Failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not reach payment server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Make a Payment</Text>

        {/* Amount */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Payment Method */}
        <Text style={styles.label}>Payment Method</Text>
        <View>
          <Dropdown
            style={styles.dropdown}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Select category"
            value={category}
            onChange={item => {
              setCategory(item.value)
              setMethod(item.label.toLowerCase() === 'momo'? 'mobile_money' : 'card');
            }}
          />
        </View>

        {/* Card Inputs */}
        
        {method === 'card' && (
          <>
            <View>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={16}
              />

              <Text style={styles.label}>Expiry (MM/YY)</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expiry}
                onChangeText={setExpiry}
                maxLength={5}
              />

              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
              />
            </View>
          </>
        )}

        {/* Mobile Money Input */}
        {method === 'mobile_money' && (
          <>
            <View>         
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                maxLength={12}
              />
            </View> 
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#00bfa5',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginVertical: 16,
    overflow: 'hidden',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 50,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00bfa5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
