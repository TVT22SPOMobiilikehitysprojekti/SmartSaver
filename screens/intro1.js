import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.intro}>Welcome to the SmartSaver</Text>
      <Text style={styles.idea}>The idea of the application is simple:{'\n'} just input your income, expenses,{'\n'} and savings goal, and the app takes{'\n'} care of the rest!</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Intro2')}>
        <Text style={styles.buttonText}>Get Started!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  intro: {
    backgroundColor: '#34a4eb',
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 100,
    textAlign: 'center',
    color: 'white',
  },
    screen: {
        backgroundColor: '#34a4eb',
        flex: 1,
    },
  idea: {
    marginTop: 30,
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    display: 'flex',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -80 }],
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default IntroScreen;