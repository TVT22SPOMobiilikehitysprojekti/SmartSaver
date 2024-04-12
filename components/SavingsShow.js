import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TouchableOpacity } from 'react-native';
import { fetchSavingsGoalsForShow, getCurrentUserId } from '../firebase/Shortcuts'; 

const SavingsShow = () => {
  const [savingsPlans, setSavingsPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dailySavingsNeeded, setDailySavingsNeeded] = useState(0);
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = getCurrentUserId();
        const unsubscribe = await fetchSavingsGoalsForShow(userId, setSavingsPlans);
        console.log('Fetch savings goals unsubscribe function:', unsubscribe);
  
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching savings goals: ", error);
      }
    }
    
    fetchData();
  
    return () => {
      // Clean-up function
    };
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      const parsedDate = new Date(selectedPlan.date);
      const currentDate = new Date();
      const daysLeft = Math.ceil((parsedDate - currentDate) / (1000 * 60 * 60 * 24));
      const amount = parseFloat(selectedPlan.amount);
      const savedAmount = parseFloat(selectedPlan.savedAmount);
      const totalAmountLeft = amount - savedAmount;
  
      console.log(`Days left: ${daysLeft}, Amount: ${amount}, Saved Amount: ${savedAmount}, Total Left: ${totalAmountLeft}`);
  
      if (daysLeft > 0 && !isNaN(totalAmountLeft) && totalAmountLeft > 0) {
        const dailySavings = totalAmountLeft / daysLeft;
        setDailySavingsNeeded(dailySavings);
      } else {
        setDailySavingsNeeded(0);
      }
  
      const monthsLeft = Math.ceil(daysLeft / 30);
      console.log(`Months left: ${monthsLeft}`);
  
      if (monthsLeft > 0 && !isNaN(totalAmountLeft) && totalAmountLeft > 0) {
        const monthlySavings = totalAmountLeft / monthsLeft;
        setMonthlySavingsNeeded(monthlySavings);
      } else {
        setMonthlySavingsNeeded(0);
      }
    }
  }, [selectedPlan]);

  const handlePress = (item) => {
    setSelectedPlan(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Muotoillaan päivämäärä (MM/PV/Vuosi)
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savingsPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePress(item)}>
            <View style={styles.planItem}>
              <Text style={styles.planText}>{item.plan}</Text>
              <Text>{formatDate(item.date)}</Text>
            </View>
          </Pressable>
        )}
      />

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="none"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Plan Details</Text>
            <Text style ={styles.planTextModalT}>Title: {selectedPlan && selectedPlan.plan}</Text>
            <Text style ={styles.planTextModalA}>Amount: {selectedPlan && selectedPlan.amount}</Text>
            <Text style ={styles.planTextModalD}>Date: {selectedPlan && formatDate(selectedPlan.date)}</Text>
            <Text>Daily Savings Needed: {dailySavingsNeeded.toFixed(2)}</Text>
            <Text>Monthly Savings Needed: {monthlySavingsNeeded.toFixed(2)}</Text>
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
  closeButton: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SavingsShow;
