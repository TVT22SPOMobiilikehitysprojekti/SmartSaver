import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import {
  fetchSavingsGoalsForShow,
  getCurrentUserId,
  handleSaveCustomAmount,
  fetchSavedAmountFromDB,
  deleteSavingsPlanDB,
  saveUserTransactionAndUpdateBalance // Varmista että tämä funktio on tuotu
} from '../firebase/Shortcuts';

const SavingsShow = () => {
  const [savingsPlans, setSavingsPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dailySavingsNeeded, setDailySavingsNeeded] = useState(0);
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState(0);
  const [customSavingsAmount, setCustomSavingsAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isSavedAmountUpdated, setIsSavedAmountUpdated] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = getCurrentUserId();
      if (userId) {
        const unsubscribe = await fetchSavingsGoalsForShow(userId, setSavingsPlans);
        return () => unsubscribe();
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      const currentDate = new Date();
      const targetDate = new Date(selectedPlan.date);
      const daysLeft = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
      const amountNeeded = parseFloat(selectedPlan.amount) - parseFloat(savedAmount);
      const dailySavings = amountNeeded / daysLeft;
      const monthlySavings = amountNeeded / Math.ceil(daysLeft / 30);
      setDailySavingsNeeded(dailySavings);
      setMonthlySavingsNeeded(monthlySavings);
      setDaysLeft(daysLeft);
    }
  }, [selectedPlan, savedAmount]);

  useEffect(() => {
    if (showModal && selectedPlan?.id) {
      async function fetchAndSetSavedAmount() {
        try {
          const userId = getCurrentUserId();
          const fetchedSavedAmount = await fetchSavedAmountFromDB(userId, selectedPlan.id);
          setSavedAmount(fetchedSavedAmount || 0);
        } catch (error) {
          console.error("Error fetching saved amount:", error);
        }
      }
      fetchAndSetSavedAmount();
    }
  }, [showModal, selectedPlan]);

  const handlePress = async (item) => {
    try {
      const savedAmount = await fetchSavedAmountFromDB(getCurrentUserId(), item.id);
      console.log("Saved amount:", savedAmount);
      setSelectedPlan(item);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching saved amount:", error);
      alert('Error fetching saved amount. Please try again.');
    }
  };

  const handleLongPress = async (item) => {
    Alert.alert(
      "Delete Savings Plan",
      `Do you want to delete "${item.plan}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Delete", onPress: () => deleteSavingsPlan(item.id) }
      ],
      { cancelable: false }
    );
  };

  const deleteSavingsPlan = async (planId) => {
    try {
      await deleteSavingsPlanDB(planId);
      setSavingsPlans(currentPlans => currentPlans.filter(plan => plan.id !== planId));
      alert('Savings plan deleted successfully.');
    } catch (error) {
      alert('Error deleting savings plan. Please try again.');
      console.error("Error deleting savings plan:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!selectedPlan) {
      alert('No plan selected.');
      return;
    }
  
    if (!customSavingsAmount || isNaN(parseFloat(customSavingsAmount))) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const transactionData = {
        amount: parseFloat(customSavingsAmount),
        isExpense: true, // Määritellään tämä olevan kulutransaktio
        category: "Savings", // Luokka, jossa tämä transaktio näkyy
        date: new Date(), // Transaktion päivämäärä
        description: `Custom savings amount for plan ${selectedPlan.plan}`
      };

      await saveUserTransactionAndUpdateBalance(selectedPlan.userId, transactionData, () => {
        console.log("Transaction and balance updated successfully.");
      }, (error) => {
        console.error("Failed to update transaction and balance: ", error);
        alert("Failed to update transaction and balance.");
      });

      await handleSaveCustomAmount(
        selectedPlan,
        customSavingsAmount,
        setCustomSavingsAmount,
        setMonthlySavingsNeeded,
        monthlySavingsNeeded,
        setSavedAmount,
        setSelectedPlan,
        setIsSavedAmountUpdated
      );
    } catch (error) {
      console.error("Error saving custom amount:", error);
      alert('Error saving custom amount. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savingsPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item)} onLongPress={() => handleLongPress(item)}>
            <View style={styles.planItem}>
              <Text style={styles.planText}>{item.plan}</Text>
              <Text>{formatDate(item.date)}</Text>
            </View>
          </Pressable>
        )}
      />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Plan Details</Text>
            <Text style={styles.planTextModalT}>Title: {selectedPlan && selectedPlan.plan}</Text>
            <Text style={styles.planTextModalA}>Amount: {selectedPlan && selectedPlan.amount}</Text>
            <Text style={styles.planTextModalSA}>Saved Amount: {savedAmount}</Text>
            <Text style={styles.planTextModalD}>Date: {selectedPlan && formatDate(selectedPlan.date)}</Text>
            <Text>Daily Savings Needed: {dailySavingsNeeded.toFixed(2)}</Text>
            <Text>Monthly Savings Needed: {monthlySavingsNeeded.toFixed(2)}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter custom save amount"
              keyboardType="numeric"
              value={customSavingsAmount}
              onChangeText={setCustomSavingsAmount}
            />
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.buttonText}>Save Custom Amount</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  planText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  planItem: {
    backgroundColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'blue',
  },
  planTextModalT: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  planTextModalD: {
    fontSize: 16,
    marginBottom: 10,
  },
  planTextModalA: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'red',
  },
  planTextModalSA: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: 'green',
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    backgroundColor: 'blue',
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SavingsShow;
