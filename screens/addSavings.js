import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableWithoutFeedback, Keyboard, Alert, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal-datetime-picker'; // Lisätään Modal datetime picker
import { auth } from '../firebase/Config';
import { saveUserSavingsGoal } from '../firebase/Shortcuts';
import { Timestamp } from '@firebase/firestore';


const AddSavingScreen = () => {
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        placeholder={'Amount (€)'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <SafeAreaView>
        <Text style={styles.pvm}>selected: {date.toLocaleString()}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'red',
  },
  setSavingsText: {
    color: 'white',
    fontSize: 30,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
  },
  showDatePickerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
    marginBottom: 20,
  },
  setSavingsButton: {
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
  pvm: {
    color: 'white',
    fontSize: 15,
    marginBottom: 15,
  },
});

export default AddSavingScreen;
