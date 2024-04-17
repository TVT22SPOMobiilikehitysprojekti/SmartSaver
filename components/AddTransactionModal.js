import React from 'react';
import { View, Modal, StyleSheet, Pressable, Text , TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign'; 
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Transaction</Text>
          <View style={styles.modalView2}>
          <TouchableOpacity style={{justifyContent: 'center'}}>
          <Icon1 name='flag' size={40} color="white" style={styles.modalButton} onPress={handleAddSavings} /> 
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center'}}>
            <Icon1 name='money' color="white" size={40}  style={styles.modalButton} onPress={handleAddExpense} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '15%',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    
  },
  modalView2: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
    marginBottom: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'blue',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddTransactionModal;
