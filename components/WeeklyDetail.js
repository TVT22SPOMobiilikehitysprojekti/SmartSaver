import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchUserTransactions, getCurrentUserId } from '../firebase/Shortcuts';

const WeeklyTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState(0);
    const [transactionsByDay, setTransactionsByDay] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getCurrentUserId();
                if (!userId) {
                    throw new Error("User ID not available.");
                }
                const userTransactions = await fetchUserTransactions(userId);

                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Adjust to Monday of the current week
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6); // Sunday of the same week

                const weekTransactions = userTransactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date.seconds * 1000);
                    return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
                });

                setTransactions(weekTransactions);
                groupTransactionsByDay(weekTransactions);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentDate, currentWeek]);

    const groupTransactionsByDay = (transactions) => {
        const grouped = {};
        transactions.forEach(transaction => {
            const dateStr = new Date(transaction.date.seconds * 1000).toDateString();
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(transaction);
        });
        setTransactionsByDay(grouped);
    };

    const changeWeek = (increment) => {
        const newCurrentDate = new Date(currentDate);
        newCurrentDate.setDate(newCurrentDate.getDate() - newCurrentDate.getDay() + 1 + increment * 7);
        setCurrentDate(newCurrentDate);
        setCurrentWeek(prevWeek => prevWeek + increment);
    };

    const setCurrentDateByDay = (day) => {
        const currentDayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - newDate.getDay() + currentDayIndex);
        setCurrentDate(newDate);
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
                {loading ? <Text>Loading...</Text> : error ? <Text>Error: {error}</Text> :
                Object.entries(transactionsByDay).map(([day, dayTransactions]) => (
                    <View key={day}>
                        <Text style={styles.dateHeader}>{day}</Text>
                        {dayTransactions.map(transaction => (
                            <TouchableOpacity key={transaction.id}>
                                <View style={styles.transaction}>
                                    <Text style={styles.transactionText}>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US')}</Text>
                                    <Text style={styles.transactionText}>Category: {transaction.category}</Text>
                                    <Text style={styles.transactionText}>Amount: {transaction.amount}</Text>
                                    <Text style={styles.transactionText}>Description: {transaction.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => changeWeek(-1)}>
                    <Text style={styles.date}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.week}>Week {getISOWeek(currentDate)}</Text>
                <TouchableOpacity onPress={() => changeWeek(1)}>
                    <Text style={styles.date}>Next</Text>
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
        borderRadius: 30,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,


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
        alignItems: 'fixed',
    },
    week: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        position: 'absolute',
        left: '35%',
    },
    date: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: 10,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    highlighted: {
        fontWeight: 'bold',
        color: 'blue',
    },
};

export default WeeklyTransactionList;