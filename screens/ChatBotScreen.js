import { keyBy } from 'lodash';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import PaymentScreen from './PaymentScreen';

export default function ChatbotScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);

  const faqKeywords = [
    {
      keywords: ['add revenue', 'revenue', 'income', 'sales'],
      answer: "Go to the Revenue tab and fill in the till and expenditure fields.",
      screen: 'DailyRevenueScreen'
    },
    {
      keywords: ['view profile', 'profile', 'my account'],
      answer: "Open the drawer and tap on 'Profile'.",
      screen: 'ProfileScreen'
    },
    {
      keywords: ['logout', 'sign out'],
      answer: "Open the drawer and tap Logout.",
      screen: 'LogoutScreen'
    },
    {
      keywords: ['view records', 'views', 'history'],
      answer: "Open the drawer and tap Views to view records.",
      screen: 'SummaryScreen'
    },
    {
      keywords: ['damages', 'damage', 'spoilage'],
      answer: "Go to the Damages tab and enter the total amount of damages incurred.",
      screen: 'DamageScreen'
    },
    {
      keywords: ['supplies', 'inventory', 'stock'],
      answer: "Go to the Stock tab and enter the total value of the stock as well as which supplier it came from.",
      screen: 'StockScreen'
    },
    {
      keywords: ['pay', 'payment', ''],
      answer: "Execute stock payments here.",
      screen: 'PaymentScreen'
    }
  ];

  const handleQuery = () => {
    const lowerQuery = query.toLowerCase();
    let matched = null;

    for (let item of faqKeywords) {
      if (
        item.keywords.some(keyword => {
          const pattern = new RegExp(`\\b${keyword}\\b`, `i`); //exact word match
          return pattern.test(lowerQuery);
        })
      ) {
        matched = item;
        break;
      }
    }

    const userMsg = { sender: 'user', text: query };
    const botMsg = matched
      ? { sender: 'bot', text: matched.answer, screen: matched.screen }
      : { sender: 'bot', text: "Sorry, I couldn't find an answer. Please try a different question." };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setQuery('');
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.bubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={styles.bubbleText}>{item.text}</Text>
      {item.sender === 'bot' && item.screen && (
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.navigateButtonText}>Go to {item.screen}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Ask me anything 👇🏿</Text>

            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="e.g. How to add revenue?"
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={setQuery}
              />
              <TouchableOpacity style={styles.askButton} onPress={handleQuery}>
                <Text style={styles.askButtonText}>Ask</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 5
  },
  chatContainer: {
    flexGrow: 1,
    paddingBottom: 20
  },
  bubble: {
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    paddingHorizontal: 10
  },
  userBubble: {
    backgroundColor: '#00bfa5',
    alignSelf: 'flex-end',
    marginHorizontal: 5
  },
  botBubble: {
    backgroundColor: '#1e1e1e',
    alignSelf: 'flex-start',
    marginHorizontal: 5
  },
  bubbleText: {
    color: '#fff',
    fontSize: 16
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginBottom: 10,
    marginHorizontal: 17,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 8
  },
  askButton: {
    backgroundColor: '#00bfa5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8
  },
  askButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  navigateButton: {
    marginTop: 10,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  navigateButtonText: {
    color: '#00bfa5',
    fontWeight: '600'
  }
});
