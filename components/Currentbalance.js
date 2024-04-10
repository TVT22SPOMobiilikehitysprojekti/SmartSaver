import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { db } from '../firebase/Config';
import { doc, onSnapshot } from 'firebase/firestore';
import { set } from 'firebase/database';


const CurrentbalanceComponent = ({userId}) => {
    const [balance, setBalance] = useState('Loading...');

    useEffect(() => {
        if (!userId) return;

        //luodaan viite 'current' saldo-dokumenttiin käyttäjän 'balances' alikokoelmassa
        const balanceDocRef = doc(db, "Users", userId, "Balances", "current");

        //kuunnellaan saldo-dokumenttia reaaliaikaisesti

        const unsubscribe = onSnapshot(balanceDocRef, (doc) => {
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

        return unsubscribe;
    }, [userId]);

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Current Balance: €{balance}</Text>
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