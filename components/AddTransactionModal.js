import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
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
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={handleAddSavings}>
                <Icon1 name='flag' size={40} color="white" style={styles.modalButton} /> 
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddExpense}>
                <Icon1 name='money' color="white" size={40} style={styles.modalButton} />
              </TouchableOpacity>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '15%',
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 20,
    width: '80%',

  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    height: 80,
    width: 80,
    margin: 15,
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'blue',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
