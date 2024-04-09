import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, Alert } from 'react-native';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/Config'; 
import PieChartComponent from '../components/MyPieChart';


const Frontpage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User is signed in with uid:", user.uid);
      } else {
        // User is signed out
        console.log("User is signed out");
        navigation.navigate('Login');
      }
    });

    return unsubscribe; // Cleanup function
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
        // Optionally navigate the user to the login screen
        // navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SmartSaver</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.menuDots}>:</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                // Add navigation or actions for settings
                console.log('Settings Pressed');
              }}>
              <Text style={styles.textStyle}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleLogout();
              }}>
              <Text style={styles.textStyle}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View>
        <PieChartComponent />
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.iconButton, styles.piggyButton]} onPress={() => navigation.navigate('Savings')}>
          <Image
            source={require('../assets/piggy-icon.png')}
            style={styles.iconImage}
          />
        </Pressable>
        <Pressable style={[styles.iconButton, styles.addButton]}>
          <Image
            source={require('../assets/plus-icon.png')}
            style={styles.iconImage}
          />
        </Pressable>
      </View>
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
  },
  headerText: {
    fontSize: 24,
  },
  menuDots: {
    fontSize: 24,
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
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    marginRight: 10,
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Frontpage;
