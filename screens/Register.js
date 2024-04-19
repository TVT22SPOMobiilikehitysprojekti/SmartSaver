import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();

const dismissKeyboard = () => {
  Keyboard.dismiss();
}

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    if (!isValid) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
    return isValid;
  };

  const validatePassword = () => {
    const isValid = password.length >= 6;
    if (!isValid) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const onSubmit = async () => {
    if (validateEmail() && validatePassword()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential.user);
  
        const uid = userCredential.user.uid;
        const userRef = doc(db, 'Users', uid);
        await setDoc(userRef, { email });
  
        navigation.navigate('Intro1');
      } catch (error) {
        console.log(error.code, error.message);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert("Registration Failed", "The email address is already in use. Please use a different email address.");
        } else {
          Alert.alert("Registration Failed", error.message);
        }
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require('../assets/smartsaver_logo.png')}
          style={styles.logo}
        />
        <Text style={styles.header}>SmartSaver</Text>
        <Text style={styles.welcomeMessage}>Welcome to SmartSaver</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text onPress={() => navigation.navigate('Login')} style={styles.signInLink}>
            Sign in
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34a4eb',
    marginBottom: 24,
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#34a4eb',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    marginTop: 20,
  },
  signInLink: {
    color: '#34a4eb',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Signup;
