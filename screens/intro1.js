
import React from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import IntroScreen2 from './intro2';

const IntroScreen = () => {
  return (
    <View>
      <Text style={styles.intro}>Welcome to the SmartSaver</Text>
      <Text style={styles.idea}>The idea of the application is simple: just input your income, expenses, and savings goal, and the app takes care of the rest!</Text>

      <Pressable style={styles.button}  onPress={() => navigation.navigate('IntroScreen2')}>
        <Text style={styles.buttonText}>Get Started!</Text>
        </Pressable> 
    </View>
  );
};


const styles = StyleSheet.create({
  intro: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  idea: {
    fontSize: 16,
    marginBottom: 10,
  },
    buttonText: {
        fontSize: 20,
        color: "white",
        justifyContent: "center",
    },
  button: {
    
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default IntroScreen;
