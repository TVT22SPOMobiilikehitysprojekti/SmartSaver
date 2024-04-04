import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IntroScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Welcome to the SmartSaver</Text>
      <Text style={styles.subtitle}>The idea of the application is simple: just input your income, expenses, and savings goal, and the app takes care of the rest!</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Intro2')}>
        <Text style={styles.buttonText}>Get Started!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
    screen: {
        justifyContent: 'center',
        position: 'center',
        padding: top = 100,
        backgroundColor: '#34a4eb',
        flex: 1,
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