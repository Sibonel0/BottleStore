import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TermsAndConditionsScreen = ({ navigation }) => {
  const handleAgree = async () => {
    
    try {
      await AsyncStorage.setItem('termsAgreed', 'true');
      // Handle agreement logic here
      Alert.alert("Thank you", "You've agreed to the Terms & Conditions.");
      navigation.navigate('HomeScreen')
    // navigation.goBack();
    } catch (error) {
      console.error('Failed to save agreement status', error);
      Alert.alert("Error", "Could not save agreement status. Please Try again.")
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Terms & Conditions</Text>

        <Text style={styles.sectionTitle}>1. Use of the App</Text>
        <Text style={styles.paragraph}>
          The App is intended to help store owners and staff manage daily revenue, stock inventory, and business summaries.
        </Text>

        <Text style={styles.sectionTitle}>2. Account Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for the accuracy of your account information and for maintaining the security of your credentials.
        </Text>

        <Text style={styles.sectionTitle}>3. Data Collection and Privacy</Text>
        <Text style={styles.paragraph}>
          Your data is collected and used according to our Privacy Policy. By using the App, you consent to that usage.
        </Text>

        <Text style={styles.sectionTitle}>4. Offline Functionality</Text>
        <Text style={styles.paragraph}>
          The app works partially offline. Offline entries will sync when the internet is available. We are not liable for unsynced data loss.
        </Text>

        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content and design belong to Ngogola Bottle Store and may not be reused without written permission.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitations of Liability</Text>
        <Text style={styles.paragraph}>
          We do not guarantee the App will always function without error. We are not responsible for data loss or service interruptions.
        </Text>

        <Text style={styles.sectionTitle}>7. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate access at any time if the App is misused or these terms are violated.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to the Terms</Text>
        <Text style={styles.paragraph}>
          We may update these terms from time to time. You will be notified of important changes through the App.
        </Text>

        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms are governed by the laws of the Kingdom of Eswatini.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          Email: support@ngogolabottlestore.com{'\n'}
          Phone: [+268 78229698]{'\n'}
          Address: [972 Mancishane Street]
        </Text>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleAgree}>
        <Text style={styles.buttonText}>I Agree</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  paragraph: { fontSize: 15, lineHeight: 22, color: '#333' },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default TermsAndConditionsScreen;
