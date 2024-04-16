import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Signup from './screens/Register';
import LoadingScreen from './screens/loading';
import IntroScreen from './screens/intro1';
import IntroScreen2 from './screens/intro2';
import IntroScreen3 from './screens/intro3';
import IntroScreen4 from './screens/intro4';
import Frontpage from './screens/frontpage';
import Savings from './screens/savings';
import SettingsScreen from './screens/settings';
import TransactionScreen from './screens/transaction';
import addSavingScreen from './screens/addSavings';
import ViewTransactionDetailsScreen from './screens/Details';
import ProfilePage from './screens/ProfilePage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process (e.g., checking authentication status)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust loading time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Directly return your LoadingScreen component during the loading phase
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Intro1" component={IntroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Intro2" component={IntroScreen2} options={{ headerShown: false }} />
            <Stack.Screen name="Intro3" component={IntroScreen3} options={{ headerShown: false }} />
            <Stack.Screen name="Intro4" component={IntroScreen4} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Frontpage" component={Frontpage} options={{ headerShown: false }} />
            <Stack.Screen name="Savings" component={Savings} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name="AddSavings" component={addSavingScreen} /> 
            <Stack.Screen name="ProfilePage" component={ProfilePage} /> 
            <Stack.Screen name="ViewTransactionDetails" component={ViewTransactionDetailsScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

