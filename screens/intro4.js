import React from 'react';
import { View, Text, StyleSheet, Pressable,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Imagepicker from '../components/Imagepicker';

const IntroScreen4 = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What next?</Text>
      <Text style={styles.instructions}>
        You can start adding expenses and incomes.{'\n'}
        <Text style={styles.emphasis}>Don’t forget to add your daily expenses and incomes during the day!</Text>{'\n\n'}
        Also remember to go add your savings goal!
      </Text>

      
      <Imagepicker />

<Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
    <Text style={styles.buttonText}>Let's go!</Text>
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
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  emphasis: {
    fontWeight: 'bold',
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#000',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: 'white',
    textAlign: 'center',
  },
  button: {
    display: 'flex',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    left: '63%',
    transform: [{ translateX: -80 }],
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default IntroScreen4;
