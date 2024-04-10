import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, db, doc, setDoc, serverTimestamp } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';

const BalanceComponent = ({ onSaved }) => {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  const handleSave = async () => {
    // Varmista, että käyttäjä on kirjautunut sisään
    const user = auth.currentUser;
    if (user) {
      try {
        // Käytä doc funktiota luodaksesi viite dokumenttiin käyttäjän UID:n avulla
        const userDocRef = doc(db, "Balance", user.uid);

        // Tallenna tai päivitä dokumentti viitteen kautta
        await setDoc(userDocRef, {
          Amount: parseFloat(amount) || 0, // Muunna merkkijono liukuluvuksi
          Timestamp: serverTimestamp() // Lisää palvelimen aikaleima
        });

        setAmount(''); // Tyhjennä kenttä onnistuneen tallennuksen jälkeen
        onSaved && onSaved(); // Jos onSaved on määritelty, kutsu sitä
        Alert.alert("Success", "Amount has been saved successfully.");
        navigation.navigate('Intro4')
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Error", "No user is logged in.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))} // Sallii vain numerot ja pisteen
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4
  }
});

export default BalanceComponent;