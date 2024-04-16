import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard,KeyboardAvoidingView, Platform} from 'react-native';
import BalanceComponent from '../components/Balance';


const IntroScreen3 = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
 

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
      <Text style={styles.header}>Money</Text>
      <Text style={styles.subtitle}>
        Step 2: How much you currently have? (Can be changed later)
      </Text>
        <BalanceComponent/>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
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
    display: 'flex',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    position: 'absolute',
    bottom: 50,
    left: '45%',
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

export default IntroScreen3;
