import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/Config'; 
import PieChartComponent from '../components/MyPieChart';
import CalendarComponent from '../components/Calendar';
import { useNavigation } from '@react-navigation/native';
import CurrentbalanceComponent from '../components/Currentbalance';
import { getCurrentUserId } from '../firebase/Shortcuts';


const Frontpage = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [showChildPressables, setShowChildPressables] = useState(false);
  const [userId, setUserId] = useState(getCurrentUserId());

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    });
    return unsubscribe;
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate('Login');
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log("Signed out successfully"))
      .catch((error) => console.error("Sign out error:", error));
  };

  const handleMenuPress = () => {
    setModalVisible(true);

  };

  const toggleChildPressables = () => {
    setShowChildPressables(!showChildPressables);
    
  };

  const handlebuttonpress = () => {
    const button1 = 'transaction';
    const button2 = 'addSavings';
    setDisplayText(`${button1}\n${button2}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SmartSaver</Text>
        <View style={styles.iconImageDotsContainer}>
          <Pressable onPress={handleMenuPress}>
            <Image
              source={require('../assets/3dots.png')}
              style={styles.iconImageDots}
            />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.calendarContainer}>
          <CalendarComponent />
        </View>
        <View style={styles.balanceInfo}>
          <CurrentbalanceComponent userId={getCurrentUserId()}/>
        </View>
        <View>
          <PieChartComponent />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          style={[styles.iconButton, styles.piggyButton]}
          onPress={() => navigation.navigate('Savings')}>
          <Image
            source={require('../assets/piggy-icon.png')}
            style={styles.iconImage}
          />
        </Pressable>
        <Pressable
          style={[styles.iconButton, styles.addButton]}
          onPress={() => toggleChildPressables()}>
          <Image
            source={require('../assets/plus-icon.png')}
            style={styles.iconImage}
          />
        </Pressable>
        {showChildPressables && (
          <View style={styles.childPressablesContainer}>
            <Pressable
              style={[styles.iconButton, styles.childButton]}
              onPress={() => navigation.navigate('AddSavings')}>
              <Image
                source={require('../assets/LippuIcon.png')}
                style={styles.iconImageChild}
              />
            </Pressable>
            <Pressable
              style={[styles.iconButton, styles.childButton]}
              onPress={() => navigation.navigate('Transaction')}>
              <Image
                source={require('../assets/PlusLogoBlue.png')}
                style={styles.iconImageChild}
              />
            </Pressable>
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => {navigation.navigate('ProfilePage'); setModalVisible(false);}}>
              <Text style={styles.modalButton}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('Settings'); setModalVisible(false);}}>
              <Text style={styles.modalButton}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.modalButton}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFEFEF',
    height: 100,
    position: 'fixed', // Fixed header
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure header is above content
  },
  headerText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconImageDotsContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  iconImageDots: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  calendarContainer: {},
  balanceInfo: {
    padding: 20,
    backgroundColor: '#EFEFEF',
  },
  balanceText: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'transparent',
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  piggyButton: {
    backgroundColor: 'red',
    borderRadius: 30,
    marginLeft: 20,
    width: 40,
    height: 40,
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    marginRight: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
  },
  iconImage: {
    width: 80,
    height: 80,
    marginLeft: 0,
  },
  iconImageChild: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 1,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 70,
    left: '55%',
    marginRight: 10,
    right: 0,
    width: 'fit-content',
  
 
  },
  modalButton: {
    padding: 15,
    paddingBottom: 30,
    width: 180,
    
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childPressablesContainer: {
    
    position: 'absolute',
    bottom: 80,
    flexDirection: 'column',
    alignItems: 'center',
    width: '185%',
  },
  childButton: {},
});

export default Frontpage;
