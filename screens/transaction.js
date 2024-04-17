import React, { useState, useEffect } from 'react';
import { View, TextInput, Switch, StyleSheet, Text, Pressable, Alert, Modal, Button, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../firebase/Config';
import { saveUserTransactionAndUpdateBalance, loadCategories, saveCategories, getCurrentUserId, fetchCurrencySymbol, fetchUserTransactions } from '../firebase/Shortcuts';
import WeeklyTransactionList from '../components/WeeklyDetail';

const AddTransactionScreen = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState(['General','Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health']);
  const [currencySymbol, setCurrencySymbol] = useState(null);


  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;
    // Haetaan käyttäjän valuuttasymboli
    fetchCurrencySymbol(userId,
      (symbol) => {
        setCurrencySymbol(symbol); // Asetetaan valuuttasymboli tilaan
      },
      (error) => {
        console.error("Error fetching currency symbol: ", error);
      }
    );
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
    <WeeklyTransactionList />
      {/* Lisätään Switch-komponentti tulon/menon valitsemiseksi */}
      <Switch
        value={isExpense}
        onValueChange={setIsExpense}
        trackColor={{ false: "#81b0ff", true: "#ff5c5c" }}
        thumbColor={isExpense ? "#f4f3f4" : "#f5dd4b"}
      />
      <Text>{isExpense ? 'Expense' : 'Income'}</Text>
      
      {/* Description-kenttä */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      
      {/* Amount-kenttä */}
      <TextInput
        style={styles.input}
        placeholder={`Amount (${currencySymbol})`}
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />

      {/* Näytetään kategorialista vain menoissa */}
      {isExpense && (
        <View style={styles.categoryContainer}>
         <Button style={styles.selectCategoryButton}
          title={category !== 'Select Category' ? category : 'Select Category'}
           onPress={() => setShowModal(true)}/>
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
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#34a4eb',
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#4CAF50', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 35,
    alignItems: 'center',
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
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  categoryContainer: {
    marginBottom: 10,
    color: '#ffffff',
  },
  categoryText: {
    fontSize: 24,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  selectCategoryButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectCategoryText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AddTransactionScreen;