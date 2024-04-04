import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingScreen from './screens/loading';
import IntroScreen from './screens/intro1';
import IntroScreen2 from './screens/intro2';
import IntroScreen3 from './screens/intro3';
import IntroScreen4 from './screens/intro4';
import Frontpage from './screens/frontpage';
import Savings from './screens/savings';
import SettingsScreen from './screens/settings';
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
          <Stack.Screen name="SmartSaver" component={IntroScreen} />
        ) : (
          <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        )}
          <Stack.Screen name="Intro2" component={IntroScreen2} />
          <Stack.Screen name="Intro3" component={IntroScreen3} />
          <Stack.Screen name="Intro4" component={IntroScreen4} />
          <Stack.Screen name="Frontpage" component={Frontpage} />
          <Stack.Screen name="Savings" component={Savings} />
          <Stack.Screen name="Settings" component={SettingsScreen} />

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
