import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchUserTransactions, getCurrentUserId } from '../firebase/Shortcuts';

const WeeklyTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactionsByDay, setTransactionsByDay] = useState({});
    const [expandedDays, setExpandedDays] = useState({}); // Tila avattujen päivien hallintaan

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getCurrentUserId();
                if (!userId) {
                    throw new Error("User ID not available.");
                }
                const userTransactions = await fetchUserTransactions(userId);
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);

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
    }, [currentDate]);

    const groupTransactionsByDay = (transactions) => {
        const grouped = {};
        transactions.forEach(transaction => {
            const dateStr = new Date(transaction.date.seconds * 1000).toDateString();
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(transaction);
        });
        const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b)); // Järjestetään päivät
        const sortedGrouped = {};
        sortedKeys.forEach(key => {
            sortedGrouped[key] = grouped[key];
        });
        setTransactionsByDay(sortedGrouped);
    };

    const toggleDayExpansion = (day) => {
        setExpandedDays(prevState => ({
            ...prevState,
            [day]: !prevState[day]
        }));
    };

    const changeWeek = (increment) => {
        const newCurrentDate = new Date(currentDate);
        newCurrentDate.setDate(newCurrentDate.getDate() + increment * 7);
        setCurrentDate(newCurrentDate);
    };

    const getISOWeek = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Weekly Transactions</Text>
            <View style={styles.dateContainer}>
                <TouchableOpacity onPress={() => changeWeek(-1)}>
                    <Text style={styles.date}>Prev</Text>
                </TouchableOpacity>
                <Text style={styles.week}>Week {getISOWeek(currentDate)}</Text>
                <TouchableOpacity onPress={() => changeWeek(1)}>
                    <Text style={styles.date}>Next</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
                {loading ? <Text>Loading...</Text> : error ? <Text>Error: {error}</Text> :
                Object.entries(transactionsByDay).map(([day, dayTransactions]) => (
                    <View key={day}>
                        <TouchableOpacity onPress={() => toggleDayExpansion(day)}>
                            <Text style={styles.dateHeader}>{day} {expandedDays[day] ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {expandedDays[day] && dayTransactions.map(transaction => (
                            <View key={transaction.id} style={styles.transaction}>
                                <Text style={styles.transactionText}>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US')}</Text>
                                <Text style={styles.transactionText}>Category: {transaction.category}</Text>
                                <Text style={styles.transactionText}>Amount: {transaction.amount}</Text>
                                <Text style={styles.transactionText}>Description: {transaction.description}</Text>
                            </View>
                        ))}
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
        backgroundColor: 'white',
        borderRadius: 30,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        textAlign: 'center',
        color: 'blue'
    },
    scrollContainer: {
        flex: 1,
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
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    week: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
};

export default WeeklyTransactionList;
