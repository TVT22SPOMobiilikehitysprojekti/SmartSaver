import React, { useState } from 'react';
import { View, TextInput, Switch, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { auth } from '../firebase/Config';
import { saveUserTransactionAndUpdateBalance } from '../firebase/Shortcuts';

const AddTransactionScreen = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [isExpense, setIsExpense] = useState(false); // false = income, true = expense
    const [date, setDate] = useState(new Date()); // Jos haluat käyttäjän asettavan päivämäärän, tarvitaan päivämääränvalitsin

    const handleSaveTransaction = () => {
      const user = auth.currentUser;
      if (user) {
        const amountValue = parseFloat(amount); // Muunna syöte numeeriseksi arvoksi
        // Oletetaan, että funktio ottaa vastaan objektin transaktion tiedoille
        saveUserTransactionAndUpdateBalance(user.uid, {
          amount: amountValue,
          date: date,
          text: text,
          isExpense: isExpense
        }, () => {
          Alert.alert("Success", "Transaction saved successfully.");
          setText('');
          setAmount('');
          // Lisää tarvittaessa logiikka päivämäärän nollaamiseksi
        }, (error) => {
          Alert.alert("Error", error.message);
        });
      } else {
        Alert.alert("Error", "You must be logged in to add a transaction.");
      }
    };

    const toggleSwitch = () => setIsExpense(previousState => !previousState);

    return (
      <View style={styles.container}>
        <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isExpense ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isExpense}
            />
        <Text style={styles.addincomeText}>{isExpense ? 'Add Expense' : 'Add Income'}</Text>
        <TextInput
          style={styles.input}
          placeholder={isExpense ? 'Category' : 'Description'}
          value={text}
          onChangeText={setText}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount (€)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Text style={styles.dateText}>Date: {date.toDateString()}</Text>
        <Pressable style={styles.addincomeButton} onPress={handleSaveTransaction} >
          <Text style={styles.buttonText}>{isExpense ? 'Add Expense' : 'Add Income'}</Text>
        </Pressable>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#34a4eb',
  },
    addincomeText: {
        color: 'white',
        fontSize: 30,
        marginBottom: 20,
    },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
    
},
  dateText: {
    marginBottom: 20,
    color: 'white',
    fontSize: 20,
  },
  addincomeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
  },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },  
});

export default AddTransactionScreen;
