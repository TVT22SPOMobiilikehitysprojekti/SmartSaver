import React from 'react';
import { View, Modal, StyleSheet, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon1 from 'react-native-vector-icons/FontAwesome';

const AddTransactionModal = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const handleAddSavings = () => {
    navigation.navigate('AddSavings');
    onClose(); // Close the modal after navigating
  };

  const handleAddExpense = () => {
    navigation.navigate('Transaction');
    onClose(); // Close the modal after navigating
  };

  const handleModalClose = () => {
    onClose(); // Close the modal when pressed outside
  };

  return (
    
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleModalClose}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable onPress={handleAddSavings} style={styles.ButtonText}>
                <Icon1 name='flag' size={40} color="white" style={styles.modalButton} /> 
                <Text>Savings</Text>
              </Pressable>
              <Pressable onPress={handleAddExpense} style={styles.ButtonText}>
                <Icon1 name='money' color="white" size={40} style={styles.modalButton} />
                <Text>Transactions</Text>
              </Pressable>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rbga(0,0,0,0.1)',
    bottom: '0',

  },
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
     elevation: 5,
  },
  ButtonText: {
    alignItems: 'center',
  },

  modalButton: {
    height: 80,
    width: 80,
    margin: 15,
    padding: 5,
    borderRadius: 20,
    backgroundColor:'blue',
    verticalAlign: 'middle',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
     elevation: 5,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',

  },
});

export default AddTransactionModal;
