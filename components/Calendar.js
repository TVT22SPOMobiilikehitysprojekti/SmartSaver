import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-native-calendars';
import { fetchSavingsGoals } from '../firebase/Shortcuts';
import { auth } from '../firebase/Config';
import { View, Modal, Text, Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Läpinäkyvä musta tausta
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Modalin leveys on 80% näytön leveydestä
    maxHeight: '80%', // Estetään modalia venymästä liian suureksi
  },
  goalItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Harmaa viiva jokaisen tavoitteen alla
    paddingBottom: 10,
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    color: '#333', // Tummanharmaa teksti
  },
  closeButton: {
    backgroundColor: '#007bff', // Sininen tausta
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center', // Keskitä nappi
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  dateText: {
    fontSize: 18,
    color: '#007bff', // Sininen päivämääräteksti
    marginBottom: 20,
    textAlign: 'center', // Keskitä päivämääräteksti
  }
});

const CalendarComponent = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedGoals, setSelectedGoals] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
  
    if (userId) {
      let unsubscribe;
      async function fetchData() {
        unsubscribe = await fetchSavingsGoals(userId, setMarkedDates, setSelectedGoals);
        console.log(typeof unsubscribe);
      }
  
      fetchData();
  
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, []);

  return (
    <View>
      <Calendar
        onDayPress={day => {
          setSelectedDate(day.dateString);
          setShowModal(true);
        }}
        markedDates={markedDates}
      />
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.dateText}>Date: {selectedDate}</Text>
              {selectedGoals[selectedDate] && selectedGoals[selectedDate].map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <Text style={styles.goalText}>Plan: {goal.plan}</Text>
                  <Text style={styles.goalText}>Amount: {goal.amount}</Text>
                </View>
              ))}
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CalendarComponent;