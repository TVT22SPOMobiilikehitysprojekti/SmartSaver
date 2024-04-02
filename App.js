import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingScreen from './screens/loading';
import IntroScreen2 from './screens/intro2'; // assuming you've moved your IntroScreen2 component to a separate file
import IntroScreen from './screens/intro1'; // assuming you've moved your IntroScreen component to a separate file
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(true);
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts before 3 seconds
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showIntro ? (
          <Stack.Screen Color = {'#16C7FF'}name="SmartSaver" component={IntroScreen} />
        ) : (
          <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        )}
          <Stack.Screen name="Intro2" component={IntroScreen2} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16C7FF',
    alignItems: 'center',
    justifyContent: 'center',

  },
  screen: {
    backgroundColor: '#16C7FF',
    flex: 1,
},
});
