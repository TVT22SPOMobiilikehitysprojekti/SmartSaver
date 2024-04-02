import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.intro}>Welcome to the SmartSaver</Text>
      <Text style={styles.idea}>The idea of the application is simple: just input your income, expenses, and savings goal, and the app takes care of the rest!</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Intro2')}>
        <Text style={styles.buttonText}>Get Started!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  intro: {
    backgroundColor: '#16C7FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
    screen: {
        backgroundColor: '#16C7FF',
        flex: 1,
    },
  idea: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default IntroScreen;