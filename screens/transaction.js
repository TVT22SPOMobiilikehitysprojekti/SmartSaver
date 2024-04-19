import React, { useState, useEffect } from 'react';
import { View, TextInput, Switch, StyleSheet, Text, Pressable, Alert, Modal, Button, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../firebase/Config';
import { saveUserTransactionAndUpdateBalance, loadCategories, saveCategories, getCurrentUserId, fetchCurrencySymbol, handleCurrencySymbolChange } from '../firebase/Shortcuts';

const AddTransactionScreen = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState(['General','Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health']);
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


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  // Käyttäjän ID
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // Kategorioiden lataaminen käyttäjäkohtaisesti
    const fetchUserCategories = async () => {
      if (userId) {
        const loadedCategories = await loadCategories(userId);
        setCategories([...loadedCategories, 'Add Category']);
      }
    };

    fetchUserCategories();
  }, [userId]);

  const handleSaveTransaction = async () => {
    if (userId) {
      // Muunna syötetty summa numeroksi
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        Alert.alert("Error", "Please enter a valid amount.");
        return;
      }

      const transactionData = {
        amount: numericAmount,
        date: new Date(),
        description: description,
        isExpense: isExpense,
        category: category === 'Add Category' ? customCategory : category,
      };

      await saveUserTransactionAndUpdateBalance(userId, transactionData, () => {
        Alert.alert("Success", "Transaction saved successfully.");
        setDescription('');
        setAmount('');
        setCategory('General');
      }, (error) => {
        Alert.alert("Error", error.message);
      });
    } else {
      Alert.alert("Error", "You must be logged in to add a transaction.");
    }
  };

  const handleSaveCategory = async () => {
    if (userId && customCategory.trim() !== '' && !categories.includes(customCategory) && customCategory !== 'Add Category') {
      const newCategories = [...categories.filter(c => c !== 'Add Category'), customCategory];
      setCategories(newCategories);
      setCategory(customCategory);
      setShowModal(false);
      setCustomCategory('');
  
      try {
        // Tallenna uusi kategorialista Firestoreen
        await saveCategories(userId, newCategories);
        console.log("Categories saved successfully");
      } catch (error) {
        console.error("Error saving categories: ", error);
        Alert.alert("Error", "Failed to save categories.");
      }
    }
  };
  
  const handleDeleteCategory = (categoryToDelete) => {
    const predefinedCategories = ['General', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health'];
    if (!predefinedCategories.includes(categoryToDelete)) {
      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete the category "${categoryToDelete}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const newCategories = categories.filter(c => c !== categoryToDelete);
              setCategories(newCategories);
              try {
                // Tallenna uusi kategorialista Firestoreen
                await saveCategories(userId, newCategories);
              } catch (error) {
                console.error("Error saving categories: ", error);
              }
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.titleText}>
        <Text style={{fontWeight: 'bold',fontSize: 20, }}>Select Transaction Type</Text>
        </View>
        {/* Tab selection bar */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabItem, isExpense ? styles.activeTabExpense : null]}
            onPress={() => setIsExpense(true)}
          >
            <Text style={styles.tabText}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, !isExpense ? styles.activeTab : null]}
            onPress={() => setIsExpense(false)}
          >
            <Text style={styles.tabText}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
        {/* Description field */}
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
      
        {/* Amount field */}
        <TextInput
          style={styles.input}
          placeholder={`Amount (${currencySymbol})`}
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        </View>
        {/* Show category list only for expenses */}
        {isExpense && (
          <View style={styles.categoryContainer}>
            <Text style={{fontSize:18,marginBottom: 15,}}>Select Category</Text>
            <View style={styles.selectCategoryButton}>
            <Button

              title={category !== 'Select Category' ? category : 'Select Category'}
              onPress={() => setShowModal(true)}
            />
            </View>
          </View>
        )}
        <Modal
          animationType="none"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <KeyboardAvoidingView 
            style={styles.centeredView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalHeader}>Categories</Text>
                  <ScrollView style={{ maxHeight: 300 }}>
                    {categories.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setCategory(item);
                          setShowModal(false);
                        }}
                        onLongPress={() => handleDeleteCategory(item)}
                      >
                        <Text style={styles.categoryText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Custom category name"
                    value={customCategory}
                    onChangeText={setCustomCategory}
                  />
                  <Button title="Save Category" onPress={handleSaveCategory} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
        <Pressable style={styles.button} onPress={handleSaveTransaction}>
          <Text style={styles.buttonText}>Add Transaction</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 20,
  },

  inputContainer:{
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 25,
  },

  titleText:{
      padding: 20,
      marginBottom: 25,
      alignItems: 'center',
      borderBottomColor: 'rgba(0,0,0, 0.2)',
      borderBottomWidth: 1

  },
  input: {
    height: 45,
    textAlign: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e8e8e8',
  },
  button: {
    backgroundColor: '#4CAF50', 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 80,

  },
  buttonText: {
    color: '#ffffff', 
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
     
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 45,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    paddingBottom: 5,
    marginBottom: 15,
  },
  modalInput: {
    height: 45,
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0, 0.2)',
  },
  categoryContainer: {
    marginBottom: 25,
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 19,
    fontStyle: 'italic',
    marginBottom: 8,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 15,
    width: '80%'
  },
  selectCategoryButton: {
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 10,
    width: '100%',
  },
  selectCategoryText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 25,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  tabItem: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0, 0.1)'
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  activeTabExpense: {
    backgroundColor: '#ff4545'
  },
  tabText: {
    fontSize: 16,
  },
});

export default AddTransactionScreen;