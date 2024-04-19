import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Login from './screens/Login';
import Signup from './screens/Register';
import LoadingScreen from './screens/loading';
import IntroScreen from './screens/intro1';
import IntroScreen2 from './screens/intro2';
import IntroScreen3 from './screens/intro3';
import IntroScreen4 from './screens/intro4';
import Frontpage from './screens/Frontpage';
import Savings from './screens/savings';
import SettingsScreen from './screens/settings';
import TransactionScreen from './screens/transaction';
import addSavingScreen from './screens/addSavings';
import ViewTransactionDetailsScreen from './screens/Details';
import ProfilePage from './screens/ProfilePage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomBar from './components/BottomBar';
import { useNavigation } from '@react-navigation/native';
import AddTransactionModal from './components/AddTransactionModal';
import CustomHeader from './components/CustomHeader';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={TabStack} options={{ headerShown: false }} />
            <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Intro1" component={IntroStack} options={{ headerShown: false }} /> 
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name="AddSavings" component={addSavingScreen} options={{headerTintColor:'blue', headerTitle: 'Add Saving' }} /> 
            <Stack.Screen name="ProfilePage" component={ProfilePage} options={{headerTintColor:'blue', headerTitle: 'Profile' }}/> 
            <Stack.Screen name="ViewTransactionDetails" component={ViewTransactionDetailsScreen}  options={{headerTintColor:'blue', headerTitle: 'Transaction Details' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function IntroStack() {
  return (
    <Stack.Navigator initialRouteName='IntroStart'>
      <Stack.Screen name="IntroStart" component={IntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="IntroStep2" component={IntroScreen2} options={{ headerShown: false }} />
      <Stack.Screen name="IntroStep3" component={IntroScreen3} options={{ headerShown: false }} />
      <Stack.Screen name="IntroStep4" component={IntroScreen4} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}


function TabStack(){
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [modalVisible, setModalVisible] = useState(false);

  const handleHomePress = () => {
    setActiveTab('home');
    navigation.navigate('Frontpage');
  };

  const handlePlusPress = () => {
    setModalVisible((prevVisible) => !prevVisible); 
  };

  const handlePenPress = () => {
    setActiveTab('savings');
    navigation.navigate('Savings');
  };
  
  return(
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <BottomBar {...props} activeTab={activeTab} onPressHome={handleHomePress} onPressPlus={handlePlusPress} onPressPen={handlePenPress} />}
      >
        <Tab.Screen name="Frontpage" component={Frontpage} options={{
        header: () => <CustomHeader title="SmartSaver" />,}}/>
        <Tab.Screen name="Savings" component={Savings}  options={{
        header: () => <CustomHeader title="Savings" />,}}/>
      </Tab.Navigator>
      <AddTransactionModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  )
}
