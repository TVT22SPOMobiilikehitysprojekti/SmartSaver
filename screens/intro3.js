import React, { useState } from 'react';
import { Pressable, StyleSheet, View, Text, TextInput } from 'react-native';


const IntroScreen3 = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Money</Text>
      <Text style={styles.subtitle}>
        Step 2: How much you currently have? (Can be changed later)
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={text => setAmount(text)}
      />
      <Pressable style={styles.button} onPress={() => navigation.navigate('Intro4')}>
        <Text style={styles.buttonText}>Start with €{parseFloat(amount).toFixed(2)}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34a4eb',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default IntroScreen3;
