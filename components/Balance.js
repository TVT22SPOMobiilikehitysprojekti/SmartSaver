import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/Config'; // Oletetaan, että auth on jo tuotu
import { saveUserBalance, getCurrentUserId, fetchCurrencySymbol, handleCurrencySymbolChange } from '../firebase/Shortcuts';

const BalanceComponent = ({ onSaved }) => {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();
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
  
  const handleSave = () => {
    const user = auth.currentUser;
    if (user) {
      saveUserBalance(user.uid, amount, 
        () => {
          setAmount(''); // Tyhjennä kenttä onnistuneen tallennuksen jälkeen
          onSaved && onSaved();
          navigation.navigate('IntroStep4'); // Navigoi toiselle näytölle
        }, 
        (error) => {
          Alert.alert("Error", error.message);
        }
      );
    } else {
      Alert.alert("Error", "No user is logged in.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={`Enter your balance (${currencySymbol})`}
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
      <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
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
    borderRadius: 4,
    backgroundColor: 'gray',
    borderColor: 'white',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 300,
},
  buttonText: {
    fontSize: 20,
    color: 'white',
},
  
});
export default BalanceComponent;