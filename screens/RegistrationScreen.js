import {
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  const handleSave = async () => {
    setNameError('');
    setSurnameError('');
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name) {
      setNameError('Name Required');
      return;
    }

    if (!surname) {
      setSurnameError('Surname Required');
      return;
    }
    if (!username) {
      setUsernameError('Username Required')
      return;
    }
    if (!password) {
      setPasswordError('Password required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords Do Not Match');
      return;
    }

    try {
      const response = await fetch("http://10.150.14.245:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, password, username }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Registration Successful!", `User ID: ${data.userId || data.UserID}`);
        setName('');
        setSurname('');
        setPassword('');
        setUsername('');
        setConfirmPassword('');
        navigation.navigate('LoginScreen', { username });
      } else {
        Alert.alert("Registration Failed", data.message || "Try Again");
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Error", "Could Not Connect To Server");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={['#B0E5F2', '#72FBA0']} style={{flexGrow: 1}}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Create Account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setName}
                value={name}
                placeholder="Enter First Name"
              />
              {nameError && <Text style={styles.errorText}>{nameError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Surname</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSurname}
                value={surname}
                placeholder="Enter Last Name"
              />
              {surnameError && <Text style={styles.errorText}>{surnameError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Enter Username"
              />
              {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Enter password"
                secureTextEntry
              />
              {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm password"
                secureTextEntry
              />
              {confirmPasswordError && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.loginLink}>
              <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
  errorText: {
    color: 'crimson',
    fontSize: 14,
    marginTop: 4,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 70,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
  },
  linkText: {
    color: '#0066cc',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;
