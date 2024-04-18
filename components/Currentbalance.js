import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from '../firebase/Config';
import { doc, onSnapshot } from 'firebase/firestore';
import { set } from 'firebase/database';
import {fetchCurrencySymbol, getCurrentUserId, handleCurrencySymbolChange} from '../firebase/Shortcuts';


const CurrentbalanceComponent = ({userId}) => {
    const [balance, setBalance] = useState('Loading...');
    const [currencySymbol, setCurrencySymbol] = useState(null);
    let unsubscribeCurrencySymbol;
    let unsubscribeBalance;


    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setCurrencySymbol(null); // Reset currency symbol if no user is logged in
            return;
        }

    // Fetch initial currency symbol
    fetchCurrencySymbol(userId)
      .then(symbol => {
        setCurrencySymbol(symbol);
      })
      .catch(error => {
        console.error("Error fetching initial currency symbol: ", error);
      });

    // Listen for currency symbol changes
    const unsubscribeCurrencySymbol = handleCurrencySymbolChange(userId, (symbol) => {
        setCurrencySymbol(symbol);
      });

                

        //luodaan viite 'current' saldo-dokumenttiin käyttäjän 'balances' alikokoelmassa
        const balanceDocRef = doc(db, "Users", userId, "Balances", "current");
        //kuunnellaan saldo-dokumenttia reaaliaikaisesti
        unsubscribeBalance = onSnapshot(balanceDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setBalance(data.Amount.toFixed(2)); //numeerinen arvo kahdella desimaalilla
            } else {
                setBalance('No balance data');
            }
        }, (error) => {
            console.error("Error reading balance: ", error);
            setBalance('Error reading balance');

        });

            // Cleanup functions
    return () => {
        unsubscribeCurrencySymbol();
        unsubscribeBalance();
      };
    }, [userId]);

    return (
        <View style={styles.container}>
                    {/* Renderöi saldo valuuttasymbolilla, jos se on saatavilla */}
                    {currencySymbol && (
                <Text style={styles.text}>Current Balance: {currencySymbol} {balance}</Text>
            )}
            {/* Jos valuuttasymbolia ei ole vielä saatavilla, näytä vain saldo */}
            {!currencySymbol && (
                <Text style={styles.text}>Current Balance: {balance}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center'
    },
    text: {
        fontSize: 20
    }
});

export default CurrentbalanceComponent;