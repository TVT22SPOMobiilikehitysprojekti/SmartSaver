import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db, doc, onSnapshot } from '../firebase/Config';
import { set } from 'firebase/database';
import { fetchCurrencySymbol, getCurrentUserId, handleCurrencySymbolChange, saveUserBalance } from '../firebase/Shortcuts';


const CurrentbalanceComponent = ({ userId }) => {
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
            <Text style={styles.balanceValue}>
                {currencySymbol && (
                    <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                )}
                </Text>
             <Text style={styles.balanceAmount}>{balance}</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        alignItems: 'center',
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 30,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        flexDirection: 'row',
       
    },
    currencySymbol: {
        fontSize: 35,
        color: 'black',

    },
    balanceAmount: {
        fontSize: 35,
        color: 'black',
        marginLeft: 5,
  
    },
    balance: {
       justifyContent:'center',
       flexDirection: 'row',
    },
});

export default CurrentbalanceComponent;