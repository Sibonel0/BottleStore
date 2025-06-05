import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

const SummaryScreen = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = async () => {
    try {
      const response = await fetch('https://ngogola.onrender.com/api/users/summary');
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-SZ', {
    style: 'currency',
    currency: 'SZL',
    minimumFractionDigits: 2,
  }).format(amount);
};
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  date.setDate(date.getDate()+1)
  return date.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
};

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
      <Text style={styles.username}>User: {item.name}</Text>
      <Text>Opening Stock: {formatCurrency(item.opening_stock)}</Text>
      <Text>Total Stock: {formatCurrency(item.total_stock)}</Text>
      <Text>Net Cash: {formatCurrency(item.net_cash)}</Text>
      <Text>Damages: {formatCurrency(item.damages)}</Text>
      <Text style={styles.closing}>Closing Stock: {formatCurrency(item.closing_stock)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <FlatList
          data={summaryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchSummary();
            }} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#248A8E',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#B8EBD2',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  username: {
    marginBottom: 5,
    color: '#444',
  },
  closing: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

export default SummaryScreen;
