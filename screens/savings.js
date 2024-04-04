import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';


const savingsPlans = [
  { id: '1', title: 'Plan1', amount: '€1,00', date: 'Apr 2 2024' },
  { id: '2', title: 'Plan2', amount: '€3198,19', date: 'Jun 8 2025' },
  // ESIMERKKI PLÄÄNEJÄ, MUOKKAA MYÖHEMMIN
];

const Savings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💰</Text>
        <Text style={styles.headerTitle}>Savings plans</Text>
      </View>
      <FlatList
        data={savingsPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <Text style={styles.planTitle}>{item.title}</Text>
            <Text style={styles.planAmount}>{item.amount}</Text>
            <Text style={styles.planDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'red',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  planItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 20,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  planDate: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Savings;
