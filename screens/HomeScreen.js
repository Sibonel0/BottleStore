import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  Animated,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

export default function HomeScreen({navigation}) {
  const [userID, setUserID] = useState(null);
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchAnim] = useState(new Animated.Value(0));
  const [tileAnim] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false); // Modal replaces animated menu

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('userID');
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUserID && storedUsername) {
          setUserID(storedUserID);
          setUsername(storedUsername);
        } else {
          Alert.alert('User not found', 'Please log in again.');
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      }
    };

    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(tileAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    loadUserData();
  }, []);

  const buttons = [
    {label: 'Daily Cash', icon: 'cash-register', onPress: () => Alert.alert('Feature currently unavailable')},
    {label: 'Stock', icon: 'cube-outline', onPress: () => Alert.alert('Feature currently unavailable')},
    {label: 'Damages', icon: 'close-circle-outline', onPress: () => Alert.alert('Feature currently unavailable')},
    {label: 'Profile', icon: 'account', onPress: () => Alert.alert('Feature currently unavailable')},
    {label: 'Payments', icon: 'wallet-outline', onPress: () => Alert.alert('Feature currently unavailable')},
  ];

  const filteredButtons = buttons.filter(btn =>
    btn.label.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header with Menu Toggle */}
        <ImageBackground source={require('../assets/images/bottleStoreLogo.jpg')} style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={() => setModalVisible(true)}>
            <Icon name="menu" size={30}  />
          </TouchableOpacity>
        </ImageBackground>

        {/* Modal Menu */}
        
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          {/* Pressing outside the menu dismisses the modal */}
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              {/* BlurView gives a glassy, iOS-like appearance */}
              <BlurView
                intensity={45} // Lower intensity = more transparent
                tint="light"
                style={styles.modalMenu}
              >
                {/* Menu Items */}
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('ProfileScreen');
                  }}
                >
                  <Icon name="account" size={20} color="#B8EBD2" />
                  <Text style={styles.menuItem}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('SummaryScreen');
                  }}
                >
                  <Icon name="file-document-outline" size={20} color="#B8EBD2" />
                  <Text style={styles.menuItem}>Daily Summary</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('PolicyScreen');
                  }}
                >
                  <Icon name="shield-check" size={20} color="#B8EBD2" />
                  <Text style={styles.menuItem}>Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('PaymentScreen');
                  }}
                >
                  <Icon name="wallet-outline" size={20} color="#B8EBD2" />
                  <Text style={styles.menuItem}>Payment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('ChatBotScreen');
                  }}
                >
                  <Icon name="robot-outline" size={20} color="#B8EBD2" />
                  <Text style={styles.menuItem}>ChatBot</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('LogoutScreen');
                  }}
                >
                  <Icon name="logout" size={20} color="#ff5252" />
                  <Text style={[styles.menuItem, styles.logoutItem]}>Logout</Text>
                </TouchableOpacity>
              </BlurView>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>



        {/* Search */}
        <Animated.View style={[styles.searchBox, {opacity: searchAnim}]}>
          <Icon name="magnify" size={24} color="#00bfa5" />
          <TextInput
            placeholder="How can we help you?"
            placeholderTextColor="#999"
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </Animated.View>

        {/* Grid */}
        <View style={styles.grid}>
          {filteredButtons.length > 0 ? (
            filteredButtons.map((btn, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.tile,
                  {
                    opacity: tileAnim,
                    transform: [{scale: tileAnim}],
                  },
                ]}
              >
                <TouchableOpacity onPress={btn.onPress} activeOpacity={0.7}>
                  <Icon name={btn.icon} size={40} color="#00bfa5" />
                  {/*<Text style={styles.tileText}>{btn.label}</Text>*/}
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <Text style={styles.noMatch}>No matching options found.</Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#244242',
    flex: 1,
  },
  header: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    padding: 12,
    borderRadius: 10,
  },
  input: {
    marginLeft: 10,
    color: '#fff',
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 10,
    
  },
  tile: {
  width: '28%', // iOS-style grid spacing
  aspectRatio: 1, // keep square shape
  backgroundColor: '#111', // dark background like iOS icons
  borderRadius: 20, // round square
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8, // Android shadow
},
tileText: {
  color: '#B8EBD2', // iOS-inspired pastel neon
  fontSize: 12,
  marginTop: 8,
  textAlign: 'center',
},
  noMatch: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
  menuIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  modalMenu: {
  padding: 16,
  marginHorizontal: 25,
  borderRadius: 30,
  overflow: 'hidden',
  backgroundColor: 'rgba(255, 255, 255, 0.15', // makes blur more noticeable
  //borderColor: 'rgba(255,255,255,0.2)',
  borderWidth: 1,
  },
  menuItem: {
    color: '#B8EBD2',
    fontSize: 16,
  },
  logoutItem: {
    color: '#ff5252',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 10, // spacing between icon and text
  },

});
