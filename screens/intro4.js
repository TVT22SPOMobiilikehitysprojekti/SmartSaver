import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Imagepicker from '../components/Imagepicker';

const IntroScreen4 = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>What next?</Text>
      <Text style={styles.instructions}>
        You can start adding expenses and incomes.{'\n'}
        <Text style={styles.emphasis}>Don’t forget to add your daily expenses and incomes during the day!</Text>{'\n\n'}
        You can also add a profile picture to your account, or press Let's go and skip that!{'\n'}
      </Text>

      
      <Imagepicker />

<Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
    <Text style={styles.buttonText}>Let's go!</Text>
  </Pressable>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#34a4eb',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginTop: 60,
  },
  instructions: {
    fontSize: 20,
    width: '80%',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  emphasis: {
    fontWeight: 'bold',
  },
  button: {
    display: 'flex',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 200,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default IntroScreen4;
