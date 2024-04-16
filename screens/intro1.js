import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import Getuserinfo from '../components/Getuserinfo';

const IntroScreen = () => {

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
  

  return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.screen}>

     
      <Getuserinfo />
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

 
  screen: {
        justifyContent: 'center',
        position: 'center',
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
});

export default IntroScreen;