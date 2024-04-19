import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('testi9@foo.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState(null)

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const onLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      console.log(error);
      let errorMessage = 'Incorrect credentials';
      setError(errorMessage);
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
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>
          No account yet? {' '}
          <Text onPress={() => navigation.navigate('Signup')} style={styles.signUpLink}>
            Sign up
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
  signUpText: {
    marginTop: 20,
  },
  signUpLink: {
    marginTop: 20,
    color: '#34a4eb',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Login;
