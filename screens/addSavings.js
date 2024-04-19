import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableWithoutFeedback, Keyboard, Alert, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal-datetime-picker'; // Lisätään Modal datetime picker
import { auth } from '../firebase/Config';
import { saveUserSavingsGoal, fetchCurrencySymbol, getCurrentUserId, handleCurrencySymbolChange } from '../firebase/Shortcuts';
import { Timestamp } from '@firebase/firestore';


const AddSavingScreen = () => {
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  let unsubscribeCurrencySymbol;


  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;
    // Haetaan käyttäjän valuuttasymboli
    fetchCurrencySymbol(userId)
    .then(symbol => {
      setCurrencySymbol(symbol);
    })
    .catch(error => {
      console.error("Error fetching initial currency symbol: ", error);
    });

  // Listen for currency symbol changes
  unsubscribeCurrencySymbol = handleCurrencySymbolChange(userId, (symbol) => {
    setCurrencySymbol(symbol);
  });

  return () => {
    unsubscribeCurrencySymbol();
  };
}, []);


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
  

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber)) {
        Alert.alert("Error", "Please enter a valid number for amount.");
        return;
      }
      
      const savingsGoalData = {
        plan: plan,
        amount: amountNumber,
        date: Timestamp.fromDate(date),
      };
  
      saveUserSavingsGoal(user.uid, savingsGoalData, () => {
        Alert.alert("Success", "Savings goal saved successfully.");
        setPlan('');
        setAmount('');
        setDate(new Date());
      }, (error) => {
        Alert.alert("Error", error.message);
      });
    } else {
      Alert.alert("Error", "You must be logged in to add a savings goal.");
    }
    
  };
  



  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
      <Text style={styles.setSavingsText}>Set Savings goal</Text>
      <View style={styles.inputFields}>
      <TextInput
        style={styles.input}
        placeholder={'Plan name'}
        value={plan}
        onChangeText={(text) => {
          setPlan(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder={`Amount (${currencySymbol})`}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
    </View>
      <SafeAreaView>
        <Text style={styles.pvm}>Selected Date : {date.toLocaleDateString()}</Text>
        <Pressable style={styles.showDatePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>Select Date</Text>
        </Pressable>

        <Modal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </SafeAreaView>
      <Pressable style={styles.setSavingsButton} onPress={handleSave} >
        <Text style={styles.buttonText}>Set savings goal</Text>
      </Pressable>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 20,
  },
  setSavingsText: {
    color: 'black',
    fontSize: 30,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 25,
  },
  inputFields:{
    width: '100%',
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
  },
  showDatePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    
  },
  setSavingsButton: {
    backgroundColor: '#4CAF50',
    padding: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pvm: {
    color: 'black',
    fontSize: 19,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 25,

  },
});

export default AddSavingScreen;
