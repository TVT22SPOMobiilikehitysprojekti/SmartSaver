import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/Config'; // Oletetaan, että auth on jo tuotu
import { saveUserBalance, getCurrentUserId, fetchCurrencySymbol } from '../firebase/Shortcuts';

const BalanceComponent = ({ onSaved }) => {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();
  const [currencySymbol, setCurrencySymbol] = useState(null);


  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;
    // Haetaan käyttäjän valuuttasymboli
    fetchCurrencySymbol(userId,
      (symbol) => {
        setCurrencySymbol(symbol); // Asetetaan valuuttasymboli tilaan
      },
      (error) => {
        console.error("Error fetching currency symbol: ", error);
      }
    );
  }, []);
  
  const handleSave = () => {
    const user = auth.currentUser;
    if (user) {
      saveUserBalance(user.uid, amount, 
        () => {
          Alert.alert("Success", "Balance has been saved successfully.");
          setAmount(''); // Tyhjennä kenttä onnistuneen tallennuksen jälkeen
          onSaved && onSaved();
          navigation.navigate('Intro4'); // Navigoi toiselle näytölle
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