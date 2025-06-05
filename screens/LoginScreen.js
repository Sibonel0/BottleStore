// LoginScreen: User login interface
import { Image, 
TextInput,
Text,
StyleSheet,
Alert,
TouchableOpacity,
View,
ActivityIndicator,
Animated,
TouchableWithoutFeedback,
KeyboardAvoidingView,
SafeAreaView,
Platform,
Keyboard} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🆕 Import AsyncStorage
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //Animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = useCallback(async () => {
    // Reset any existing validation messages
    setUsernameError('');
    setPasswordError('');

    // Check if username is provided
    if (!username) {
      setUsernameError("Username required");
      return;
    }

    // Check if password is provided
    if (!password) {
      setPasswordError("Password required");
      return;
    }

    setLoading(true);

    try {
      // Send login request to backend
      const response = await fetch("http://10.150.13.91:3000/api/users/login", {
        method: "POST", // HTTP POST for login
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }) // send credentials
      });

      const data = await response.json(); // parse response body

      console.log("Login response:", data);

      if (response.ok) {
        
        // 🆕 Save user data to AsyncStorage for persistent access
        await AsyncStorage.setItem('user', JSON.stringify({
          userID: data.userID,
          username: data.username
        }));

        // 🧠 Save user data locally in AsyncStorage
        if (data.userID){
          await AsyncStorage.setItem('userID', data.userID.toString());
        } else console.warn('UserId not returned from API')
        await AsyncStorage.setItem('username', data.username);;

        // ✅ Set the session flag
        await AsyncStorage.setItem('isLoggedIn', 'true');

        // Clear inputs
        setUsername('');
        setPassword('');

        // Notify user
        Alert.alert("Login Successful", `Welcome, ${data.username}`);

        // Navigate to main app screen
        navigation.navigate('HomeScreen');
      } else {
        // Login failed (e.g., wrong credentials)
        Alert.alert("Login Failed", data.message || "Invalid username or password");
      }

    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  }, [username, password, navigation]);

  return (
        <LinearGradient colors={['#B0E5F2', '#72FBA0']} style={{flex:1}}>
          <SafeAreaView style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{flex: 1}}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={require('../assets/images/BuzzHubAlt.png')}
                    style={styles.image}
                  />
                </View>

                <KeyboardAvoidingView
                  style={{flex: 1}}
                  behavior={Platform.OS === 'ios'? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios'? 25 : 20}
                >
                  <View style={styles.formContent}>

                    <View style={styles.inputWithIconWrapper}>
                      <Ionicons name='person-outline' size={24} color={"#666"} style={styles.inputIcon} />
                      <TextInput
                        style={styles.inputWithIcon}
                        onChangeText={setUsername}
                        value={username}
                        placeholder='Enter Username'
                      />
                      {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
                    </View>

                    <View style={styles.inputWithIconWrapper}>
                      <TextInput
                        style={styles.inputWithIcon}
                        onChangeText={setPassword}
                        value={password}
                        placeholder='Enter Password'
                        secureTextEntry={!showPassword}
                        autoCapitalize='none'
                        autoCorrect={false}
                        returnKeyType='done'
                        onSubmitEditing={handleLogin}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                    </View>
                    {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

                    

                    {loading ? (
                      <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 20 }} />
                    ) : (
                      <TouchableWithoutFeedback
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleLogin}
                      >
                        <Animated.View style={[styles.loginButton, { transform: [{ scale: scaleAnim }] }]}>
                          <Text style={styles.loginButtonText}>Login</Text>
                        </Animated.View>
                      </TouchableWithoutFeedback>
                    )}

                    <TouchableOpacity onPress={() => navigation.navigate('RegistrationScreen')} style={styles.loginLink}>
                      <Text style={styles.linkText}>Not A User? Sign Up!</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </LinearGradient>
      
  );
};

// 🖌️ Modern styling for form UI
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
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
    marginHorizontal: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginHorizontal: 10
  },
  errorText: {
    color: 'crimson',
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 60
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
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
  headerWrapper: {
    justifyContent: 'center',
    marginTop: 40,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1.5,

  },
  image: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderRadius:30,
},
formContent: {
  flex: 1,
  padding: 10,
  justifyContent: 'center'
},
 passwordInputWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 12,
  marginTop: 10,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
  marginHorizontal: 10,
},
toggleText: {
  color: '#0066cc',
  fontWeight: 'bold',
  alignSelf:'flex-end' ,
  borderRadius: 20,
},
inputWithIconWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 12,
  marginHorizontal: 10,
  backgroundColor: '#fff',
  marginTop: 10,
},
inputIcon: {
  marginRight: 10,
},
inputWithIcon: {
  flex: 1,
  fontSize: 16,
}

});

export default LoginScreen;
