import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
//import DateTimePicker from '@react-native-community/datetimepicker';
import { set } from 'firebase/database';
import { auth, Firestore, collection, addDoc, db, setDoc, doc } from '../firebase/Config';


const AddSavingScreen = ({onSaved}) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');

  
  const handleSave = async () => {
    // Varmista, että käyttäjä on kirjautunut sisään
    const user = auth.currentUser;
    if (user) {
      try {
        // Käytä doc funktiota luodaksesi viite dokumenttiin käyttäjän UID:n avulla
        const userDocRef = doc(db, "SavingsGoal", user.uid);

        // Tallenna tai päivitä dokumentti viitteen kautta
        await setDoc(userDocRef, {
            amount: amount,
            date: date,
            text: text , // Lisää palvelimen aikaleima
        });

        setText('');
        setAmount('');
        setDate(new Date()); // Tyhjennä kenttä onnistuneen tallennuksen jälkeen
        onSaved && onSaved(); // Jos onSaved on määritelty, kutsu sitä
        Alert.alert("Success", "Saving goal has been saved successfully.");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Error", "No user is logged in.");
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
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder={'Amount (€)'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.dateText}>
        By what date:</Text>
        <DateTimePicker
            style={styles.dateText}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
          }}
        />

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
