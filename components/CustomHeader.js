import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ title }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

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


    const handleMenuPress = () => {
        setModalVisible(true);
    
      };

      const handleLogout = () => {
        signOut(auth)
          .then(() => console.log("Signed out successfully"))
          .catch((error) => console.error("Sign out error:", error));
      };
      
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconImageDotsContainer}>
          <Pressable onPress={handleMenuPress}>
            <Image
              source={require('../assets/3dots.png')}
              style={styles.iconImageDots}
            />
          </Pressable>
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
            <TouchableOpacity onPress={() => { navigation.navigate('ProfilePage'); setModalVisible(false); }}>
              <Text style={styles.modalButton}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Settings'); setModalVisible(false); }}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    height: 100,
    position: 'fixed', 
    elevation: 5,
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
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
  modalView: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 1,
    alignItems: 'flex-start',
    position: 'absolute',
    top: '10%',
    left: '50%',
    marginRight: 10,
    right: 0,
    width: 'fit-content',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

});

export default CustomHeader;