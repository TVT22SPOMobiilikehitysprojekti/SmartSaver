import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { fetchUserTransactions, getCurrentUserId } from '../firebase/Shortcuts'; 

const WeeklyTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date()); 
    const [currentWeek, setCurrentWeek] = useState(0); 
    const [highlightedDays, setHighlightedDays] = useState([]); 

    // Funktio nykyisen päivän asettamiseksi valitun päivän mukaan
    const setCurrentDateByDay = (day) => {
        const currentDayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
        const today = new Date();
        const selectedDate = new Date(today.setDate(today.getDate() - today.getDay() + currentDayIndex));
        setCurrentDate(selectedDate);
    };
      // Funktio viikon vaihtamiseksi
    const changeWeek = (increment) => {
        setCurrentWeek(prevWeek => prevWeek + increment);
    };
    
    useEffect(() => {// Effekti datan hakemiselle aina kun nykyinen päivämäärä tai viikko muuttuu
        const fetchData = async () => {
            try {
                const userId = getCurrentUserId(); // Haetaan käyttäjän ID
    
                if (userId) {
                    const userTransactions = await fetchUserTransactions(userId); // Haetaan käyttäjän tapahtumat
    
                    // Lasketaan valitun viikon alku- ja loppupäivämäärät
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (currentWeek * 7)); // Asetetaan valitun viikon alku
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6); // Asetetaan valitun viikon loppu
    
                    // Suodatetaan transactioneita valitulle viikolle
                    const filteredTransactions = userTransactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date.seconds * 1000); // Oletetaan, että 'date' on Firestore Timestamp
                        return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
                    });
    
                    // Suodatetaan transactioneita valitulle päivälle
                    const startOfDay = new Date(currentDate);
                    startOfDay.setHours(0, 0, 0, 0);    // Asetetaan päivän alku
                    const endOfDay = new Date(currentDate);
                    endOfDay.setHours(23, 59, 59, 999); // Asetetaan päivän loppu
    

                    const transactionsForDay = filteredTransactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date.seconds * 1000); // Oletetaan, että 'date' on Firestore Timestamp
                        return transactionDate >= startOfDay && transactionDate <= endOfDay;
                    });
    
                    setTransactions(transactionsForDay);
    
                    // Haetaan päivät, joilla on transactioneita
                    const daysWithTransactions = filteredTransactions.map(transaction => {
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
    
       
        return () => {
            
        };
    }, [currentDate, currentWeek]); // Suoritetaan uudelleen aina kun currentDate tai currentWeek muuttuu
    
    

    
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>
            <ScrollView style={styles.scrollContainer}>
                {error && <Text>Error: {error}</Text>}
                {transactions.map(transaction => (
                    <TouchableOpacity key={transaction.id}>
                        <View style={styles.transaction}>
                            <Text style={styles.transactionText}>Date: {new Date(transaction.date.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}</Text>
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
        backgroundColor: 'yellow',
    },
};

export default WeeklyTransactionList;
