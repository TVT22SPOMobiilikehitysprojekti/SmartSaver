import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Button, Dimensions } from 'react-native';
import { firestore, collection, onSnapshot, query, where, deleteDoc } from '../firebase/Config';
import { getCurrentUserId, deleteTransaction, updateTransaction, fetchCurrencySymbol, handleCurrencySymbolChange } from '../firebase/Shortcuts';
import { convertFirebaseTimeStampToJS } from '../helpers/TimeConvert';
import EditModal from '../components/EditModal';
import Icon from 'react-native-vector-icons/FontAwesome6'; 

const Details = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState('');
  const [initialEditValues, setInitialEditValues] = useState({});
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState(null); 

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;

    fetchCurrencySymbol(userId)
      .then(symbol => {
        setCurrencySymbol(symbol);
      })
      .catch(error => {
        console.error("Error fetching initial currency symbol: ", error);
      });

    return handleCurrencySymbolChange(userId, (symbol) => {
      setCurrencySymbol(symbol);
    });
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
          date: convertFirebaseTimeStampToJS(data.date), 
          isExpanded: false 
        });
      });


      const sortedTransactions = tempTransactions.sort((a, b) => {
        let aValue = a[sortBy.field];
        let bValue = b[sortBy.field];

        if (sortBy.field === 'date') {
          aValue = new Date(a.date.replace(/(\d+)\.(\d+)\.(\d+)\s+(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1T$4:$5:$6'));
          bValue = new Date(b.date.replace(/(\d+)\.(\d+)\.(\d+)\s+(\d+)\.(\d+)\.(\d+)/, '$3-$2-$1T$4:$5:$6'));
        }

        if (sortBy.order === 'desc') {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });
  

      const filteredTransactions = filterCategory ? sortedTransactions.filter(transaction => transaction.category === filterCategory) : sortedTransactions;
  
      setTransactions(filteredTransactions);
    });
  
    return unsubscribe;
  }, [sortBy, filterCategory]);


  const toggleSortOrder = (field) => {
    if (sortBy.field === field) {
      setSortBy({ ...sortBy, order: sortBy.order === 'desc' ? 'asc' : 'desc' });
    } else {
      setSortBy({ field, order: 'desc' });
    }
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

  const handleDeleteAllTransactions = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all transactions?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            Promise.all(transactions.map(transaction => deleteTransaction(getCurrentUserId(), transaction.id)))
              .then(() => {
                console.log("All transactions deleted successfully.");
                setTransactions([]);
              })
              .catch(error => {
                console.error("Error deleting all transactions:", error);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const toggleExpand = (id) => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === id) {
        return { ...transaction, isExpanded: !transaction.isExpanded };
      }
      return transaction;
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleDeleteAllTransactions}>
        <Text style={styles.deleteallbutton}>Delete All Transactions</Text>
      </TouchableOpacity>
      <View style={styles.sortFilterContainer}>
        <Button
          title={`Sort by Date  ${sortBy.field === 'date' ? (sortBy.order === 'desc' ? '↓' : '↑') : ''}`}
          onPress={() => toggleSortOrder('date')}
        />
        <Button
          title={`Sort by Amount  ${sortBy.field === 'amount' ? (sortBy.order === 'desc' ? '↓' : '↑') : ''}`}
          onPress={() => toggleSortOrder('amount')}
        />
       
      </View>
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionContainer}>
          <TouchableOpacity onPress={() => toggleExpand(transaction.id)} style={styles.editButton}>
          <View style={styles.transactionDetails}>
            <Text style={[styles.detail, { fontSize: 16, marginBottom: 10,}]}>{transaction.category}</Text>
            <Text style={[styles.detail, { fontSize: 18, fontWeight: 'bold' }]}>{transaction.amount}{currencySymbol}</Text>
            {!transaction.isExpanded && <Text style={[styles.detail, { fontSize: 10, color:'grey', marginTop: 5, }]}>Tap to open</Text>}
            {transaction.isExpanded && <Text style={[styles.detail, {marginTop: 10,}]}>Description: {'\n'}{transaction.description}</Text>}
          </View>
          </TouchableOpacity>
          <Text style={styles.date}> {transaction.date}</Text>
          <TouchableOpacity onPress={() => handleDelete(transaction.id)} style={styles.deleteButton}>
            <Icon name='trash-can' size={25} color={'red'} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
  },
  deleteallbutton: {
    marginBottom: 10,
    backgroundColor: 'red',
    padding: 10,
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
  },
  sortFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,

  },
  transactionDetails: {
    overflow: 'hidden',
  },
  date:{
    position: 'absolute',
    right: 5,
    bottom: 0,
  },
  detail: {
    width: Dimensions.get("window").width / 1.5
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
    
  },
});

export default Details;
