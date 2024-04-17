import React, { useState, useEffect,  } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity , ScrollView, Alert } from 'react-native';
import { firestore, collection, onSnapshot, query, where, deleteDoc, doc } from '../firebase/Config'; // Import Firebase
import { getCurrentUserId, deleteTransaction, updateTransaction, fetchCurrencySymbol, handleCurrencySymbolChange  } from '../firebase/Shortcuts';
import { convertFirebaseTimeStampToJS } from '../helpers/TimeConvert'
import EditModal from '../components/EditModal';


const Details = ({ navigation }) => {
    const [transactions, setTransactions] = useState([]); 
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState('');
    const [initialEditValues, setInitialEditValues] = useState({});
    const [currencySymbol, setCurrencySymbol] = useState(null);
    let unsubscribeCurrencySymbol;
  
    useEffect(() => {
      const userId = getCurrentUserId();
      if (!userId) return;
      // Haetaan käyttäjän valuuttasymboli
      fetchCurrencySymbol(userId)
      .then(symbol => {
        setCurrencySymbol(symbol);
      })
      .catch(error => {
        console.error("Error fetching initial currency symbol: ", error);
      });
  
    // Listen for currency symbol changes
    unsubscribeCurrencySymbol = handleCurrencySymbolChange(userId, (symbol) => {
      setCurrencySymbol(symbol);
    });
  
    return () => {
      unsubscribeCurrencySymbol();
    };
  }, []);

    useEffect(() => {

      const currentUserID = getCurrentUserId();
      const q = query(
        collection(firestore, 'Users', currentUserID, 'Transactions'),
        where('isExpense', '==', true)
      );
    
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tempTransactions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tempTransactions.push({
            id: doc.id,
            category: data.category,
            amount: data.amount,
            description: data.description,
            date: convertFirebaseTimeStampToJS(doc.data().date), 
          });
        });
        setTransactions(tempTransactions);
      });
    
      return unsubscribe;
    }, []);

    const handleEdit = (transaction) => {
        setSelectedTransactionId(transaction.id);
        setEditModalVisible(true);
        setInitialEditValues({ amount: transaction.amount, });
    };
    
    const handleSaveEdit = async (newData) => {
        setEditModalVisible(false);
        try {
        
          await updateTransaction(getCurrentUserId(), selectedTransactionId, newData);
          console.log("Transaction updated successfully.");
        } catch (error) {
          console.error("Error updating transaction:", error);
        }
      };
    
      const handleCancelEdit = () => {
        setEditModalVisible(false);
      };


  const handleDelete = async (id) => {

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteTransaction(getCurrentUserId(), id);
            } catch (error) {
              console.error("Error deleting transaction:", error);
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Transaction Details</Text>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionContainer}>
          <TouchableOpacity onPress={() => handleEdit(transaction.id)} style={styles.editButton}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <View style={styles.transactionDetails}>
            <Text style={styles.detail}>Category: {transaction.category}</Text>
            <Text style={styles.detail}>Amount: {transaction.amount}{currencySymbol}</Text>
            <Text style={styles.detail}>Description: {transaction.description}</Text>
            <Text style={styles.detail}>Date: {transaction.date}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(transaction.id)} style={styles.deleteButton}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
               <EditModal
  visible={editModalVisible}
  onSave={handleSaveEdit}
  onClose={handleCancelEdit}
  initialValue={initialEditValues}
/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  detail: {
    marginBottom: 5,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default Details;
