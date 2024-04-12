import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableWithoutFeedback, Keyboard, Alert, SafeAreaView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../firebase/Config';
import { saveUserSavingsGoal } from '../firebase/Shortcuts';
import { Timestamp } from '@firebase/firestore';


const AddSavingScreen = () => {
  const [plan, setPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const amountNumber = parseFloat(amount); // Muunna syöte numeeriseksi arvoksi korjattu muuttujan nimi
      if (isNaN(amountNumber)) {
        Alert.alert("Error", "Please enter a valid number for amount.");
        return;
      }
      
      // Luodaan objekti säästötavoitteen datalle
      const savingsGoalData = {
        plan: plan,
        amount: amountNumber, // Käytä korjattua muuttujan nimeä
        date: Timestamp.fromDate(date), // Muunna JavaScriptin Date-objekti Firestore Timestamp-objektiksi
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
  
  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
  

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
        <Text>selected: {date.toLocaleString()}</Text>
        <Pressable style={styles.showDatePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Select Date</Text>
      </Pressable>
      
      {showDatePicker && (
        <DateTimePicker
          style={styles.datePicker}
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false); // Hide the DateTimePicker after a date is selected
            setDate(currentDate);
          }}
        />
      )}  
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
  dateText: {
    marginBottom: 20,
    color: 'white',
    fontSize: 20,
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
});

export default AddSavingScreen;
