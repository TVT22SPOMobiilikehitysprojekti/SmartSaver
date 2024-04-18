import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchUserTransactions, getCurrentUserId } from '../firebase/Shortcuts'; // Import your functions from './Config'

const WeeklyTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with current date
    const [currentWeek, setCurrentWeek] = useState(0); // Initialize with current week
    const [highlightedDays, setHighlightedDays] = useState([]); 
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getCurrentUserId(); // Get the current user's ID

                if (userId) {
                    const userTransactions = await fetchUserTransactions(userId);
                    
                    // Calculate start and end dates for the selected week
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (currentWeek * 7)); // Set to first day of the selected week
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6); // Set to last day of the selected week
                    
                    // Filter transactions for the selected week and day
                    const filteredTransactions = userTransactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date.seconds * 1000); // Assuming 'date' is a Firestore Timestamp
                        return transactionDate >= startOfWeek && transactionDate <= endOfWeek && transactionDate.getDay() === currentDate.getDay();
                    });

                    const filteredTransactionsWeek = userTransactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date.seconds * 1000); // Assuming 'date' is a Firestore Timestamp
                        return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
                    });

                    setTransactions(filteredTransactions, filteredTransactionsWeek);

                    const daysWithTransactions = filteredTransactionsWeek.map(transaction => {
                        const transactionDate = new Date(transaction.date.seconds * 1000); // Oletetaan, että 'date' on Firestore Timestamp
                        return transactionDate.toLocaleDateString('en-US', { weekday: 'short' });
                        
                   
                    });
    
                    setHighlightedDays([...new Set(daysWithTransactions)]); // Poistetaan duplikaatit ja asetetaan highlightetut päivät

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
    }, [currentDate, currentWeek]); // Re-run effect whenever currentDate or currentWeek changes

    const changeWeek = (increment) => {
        setCurrentWeek(prevWeek => prevWeek + increment);
    };

    const setCurrentDateByDay = (day) => {
        const currentDayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
        const today = new Date();
        const selectedDate = new Date(today.setDate(today.getDate() - today.getDay() + currentDayIndex));
        setCurrentDate(selectedDate);
    };
    
    const getISOWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return weekNo;
    };

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <ScrollView style={styles.scrollContainer}>
                {error && <Text>Error: {error}</Text>}
                {transactions.map(transaction => (
                    <TouchableOpacity key={transaction.id}>
                        <View style={styles.transaction}>
                            <Text style={styles.transactionText}>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</Text>
                            <Text style={styles.transactionText}>Category: {transaction.category}</Text>
                            <Text style={styles.transactionText}>Amount: {transaction.amount}</Text>
                            <Text style={styles.transactionText}>Description: {transaction.description}</Text>
                           

                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.dateContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Text key={index} style={[styles.date, highlightedDays.includes(day) && styles.highlighted]} onPress={() => setCurrentDateByDay(day)}>{day}</Text>
                ))}
            </View>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => changeWeek(-1)}>
                    <Text style={styles.date}>Previous Week</Text>
                </TouchableOpacity>
                <Text style={styles.date}>Week {getISOWeek(currentDate)}</Text>
                <TouchableOpacity onPress={() => changeWeek(1)}>
                    <Text style={styles.date}>Next Week</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 25,

    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    transaction: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingBottom: 10,
    },
    transactionText: {
        fontSize: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        width: '100%',
        height: 40,
        alignItems: 'center',
    },
    date: {
        fontSize: 14,
    },
    highlighted: {
        fontWeight: 'bold',
        color: 'blue',
    },
    highlighted2: {
        
        backgroundColor: 'yellow',
    },
};

export default WeeklyTransactionList;