import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.intro}>Welcome to the SmartSaver</Text>
      <Text style={styles.idea}>The idea of the application is simple: just input your income, expenses, and savings goal, and the app takes care of the rest!</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  intro: {
    backgroundColor: '#34a4eb',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
    screen: {
        backgroundColor: '#34a4eb',
        flex: 1,
    },
  idea: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    display: 'flex',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default IntroScreen;