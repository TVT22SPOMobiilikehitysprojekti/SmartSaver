import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, ScrollView } from 'react-native';
import { fetchUserTransactions, getCurrentUserId } from '../firebase/Shortcuts'; // Import your functions from './Config'
import { Positions } from 'react-native-calendars/src/expandableCalendar';
import { max } from 'moment';

const WeeklyTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility
    const [selectedTransaction, setSelectedTransaction] = useState(null); // State for storing selected transaction

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getCurrentUserId(); // Get the current user's ID

                if (userId) {
                    const userTransactions = await fetchUserTransactions(userId);
                    setTransactions(userTransactions);
                } else {
                    throw new Error("User ID not available.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            // Cleanup logic if needed
        };
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Transactions</Text>
          <ScrollView style={styles.scrollContainer}>
            {error && <Text>Error: {error}</Text>}
            {transactions.map(transaction => (
              <View key={transaction.id} style={styles.transaction}>
                <Text style={styles.transactionText}>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</Text>
                <Text style={styles.transactionText}>Amount: {transaction.amount}</Text>
                <Text style={styles.transactionText}>Description: {transaction.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
};

const styles = {
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: 'white',
        maxHeight: '40%',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    transaction: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc', 
        paddingBottom: 8, 
    },
    transactionText: {
        fontSize: 16,
    },
    scrollContainer: {
        maxHeight: '90%',
    },
};

export default WeeklyTransactionList;
