// DamageScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

const DamageScreen = () => {
  const [userId, setUserId] = useState(null);
  const [totalDamages, setTotalDamages] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
      const loadUserId = async () => {
        const storedId = await AsyncStorage.getItem('userID');
        setUserId(storedId);
      };
      if (isFocused) loadUserId();
  }, [isFocused]);

  async function handleSubmit() {
    if (!totalDamages) {
      Alert.alert('Validation Error', 'Total damages are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://ngogola.onrender.com/api/users/damages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          totalDamages: parseFloat(totalDamages),
          //date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Damage recorded');
        setTotalDamages('');
      } else {
        Alert.alert('Error', data.message || 'Could not save');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#244242', '#000']} style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Report Damages</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter total damages"
            value={totalDamages}
            onChangeText={setTotalDamages}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#0066cc" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 80,

  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
});

export default DamageScreen;