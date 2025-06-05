import React, { useState, useEffect } from 'react';
import { View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
Alert,
ActivityIndicator,
SafeAreaView,
TouchableWithoutFeedback,
Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

const DailyRevenueScreen = () => {
  const [till, setTill] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [netCash, setNetCash] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadUserId = async () => {
      const storedId = await AsyncStorage.getItem('userID');
      setUserId(storedId);
    };
    if (isFocused) loadUserId();
  }, [isFocused]);

  useEffect(() => {
    if (till && expenditure) {
      const calcNet = till - expenditure;
      if (!isNaN(calcNet)) setNetCash(calcNet.toFixed(2));
    }
  }, [till, expenditure]);

  const notify = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Revenue Recorded 💰',
        body: `Till: E${parseFloat(till).toFixed(2)}\nExpenditure: E${parseFloat(expenditure).toFixed(2)}\nNet Cash: E${parseFloat(netCash).toFixed(2)}`,
        sound: true,     // Enable custom sound
        vibrate: [0, 250, 250, 250]
      },
      trigger: null, // Immediate
    });
  }

  const saveNotification = async () => {
    await fetch('https://ngogola.onrender.com/api/users/saveNotifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        message: `Revenue recorded: Till E${till}, Expenditure E${expenditure}, NetCash E${netCash}`
      }),
    });
  }


  const handleSave = async () => {
    if (!till || !expenditure || !netCash) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }
    setLoading(true);
    try {
      //Posting Daily Revenue
      const response = await fetch('https://ngogola.onrender.com/api/users/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({till: parseFloat(till), 
          expenditure: parseFloat(expenditure), 
          netCash: parseFloat(netCash), 
          userId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {

        //Save daily stock summary with netCash
        await fetch('https://ngogola.onrender.com/api/users/daily-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            netCash: parseFloat(netCash)
          })
        });

        Alert.alert('Revenue & Summary Saved!');
        setTill('');
        setExpenditure('');
        setNetCash('');

       notify(); //To send notfication with details
       saveNotification(); // To save notification to database
       
      } else {
        Alert.alert('Error', data.message || 'Could not save revenue');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save revenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#f8f8f8', '#000']} style={styles.container}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.title}>Daily Revenue</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Till"
              value={till}
              onChangeText={setTill}
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Expenditure"
              value={expenditure}
              onChangeText={setExpenditure}
            />
            <TextInput
              style={styles.input}
              placeholder="Net Cash"
              value={netCash}
              editable={false}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
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
  inputGroup: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 60,
    marginHorizontal: 80
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default DailyRevenueScreen;