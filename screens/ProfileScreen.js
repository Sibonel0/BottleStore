import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localProfileUri, setLocalProfileUri] = useState(null); // for temporary profile image

  useEffect(() => {
    const fetchProfile = async () => {
      const id = await AsyncStorage.getItem('userID');
      console.log('UserID: ', id)
      setUserId(id);
      if (!id) return;

      try {
        const [notifRes, userRes] = await Promise.all([
          fetch(`https://ngogola.onrender.com/api/users/getNotifications/${id}`),
          fetch(`https://ngogola.onrender.com/api/users/getUserInfo/${id}`)
        ]);

        const notifData = await notifRes.json();
        const userData = await userRes.json();

        //console.log('NOTIFICATIONS..', notifData)
        console.log('USER DATA: ', userData)

        setNotifications(notifData);
        setUserInfo(userData);

      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    date.setDate(date.getDate()+1)
    return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  };

  // Opens device image picker and allows user to select a new profile picture
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalProfileUri(uri); // show locally immediately

      // OPTIONAL: Upload to server
      try {
        const formData = new FormData();
        formData.append('profileImage', {
          uri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

        const uploadResponse = await fetch(`https://ngogola.onrender.com/api/users/uploadProfileImage/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          Alert.alert('Success', 'Profile picture updated.');
        } else {
          Alert.alert('Error', 'Failed to upload profile image.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Could not upload profile image.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {userInfo.length > 0 && (
          <>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{
                  uri:
                    localProfileUri ||
                    userInfo[0].profile_url ||
                    'https://via.placeholder.com/100',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{userInfo[0].name || 'User'}</Text>
            <Text style={styles.changeText}>Tap image to change</Text>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#244242' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10, borderWidth: 0.3 },
  name: { fontSize: 20, fontWeight: 'bold' },
  changeText: { fontSize: 12, color: '#888', marginTop: -6 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10, marginHorizontal: 10 },
  notification: {
    backgroundColor: '#B0E5F2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    marginHorizontal: 10
  },
  message: { fontSize: 15 },
  date: { fontSize: 12, color: '#555', marginTop: 4 },
});

export default ProfileScreen;
