import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './screens/loading';
import IntroScreen from './screens/intro1';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowIntro(true);
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      {showIntro ? <IntroScreen /> : <LoadingScreen />}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16C7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
