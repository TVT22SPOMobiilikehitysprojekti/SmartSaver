import React from 'react';
import { Pressable, StyleSheet, View, Text, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const IntroScreen2 = ({navigation}) => {
  const currencies = [
    { id: 1, name: 'USD' },
    { id: 2, name: 'EUR' },
    { id: 3, name: 'GBP' },
    // muokataan myöhemmin
  ];

  return (
    <View style={styles.container}>
      <Text>Let’s go step by step!</Text>
      <Text>Step 1: What currency do you use? (Can be changed later in settings)</Text>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
      <Pressable style={styles.button} onPress={() => navigation.navigate('Intro3')}>
        <Text style={styles.buttonText}>Next</Text>
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
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default IntroScreen2;
