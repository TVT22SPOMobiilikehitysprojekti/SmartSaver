import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Calendar } from 'react-native-calendars';
import { fetchSavingsGoals, fetchCurrencySymbol, getCurrentUserId } from '../firebase/Shortcuts';
import { auth } from '../firebase/Config';
import { View, Modal, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';

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
  },
  calendarContainer:{
    overflow: 'hidden',
  },
  monthTouchable: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
});

const CalendarComponent = forwardRef((props, ref) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedGoals, setSelectedGoals] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [calendarHeight, setCalendarHeight] = useState(80); // Lisätty kalenterin korkeus

  const calendarRef = useRef(null);

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

  useEffect(() => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
  
    if (userId) {
      let unsubscribe;
      async function fetchData() {
        unsubscribe = await fetchSavingsGoals(userId, setMarkedDates, setSelectedGoals);
      }
  
      fetchData();
  
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, []);

  const toggleCalendarSize = () => {
    setCalendarHeight(prevHeight => prevHeight === 55 ? 320 : 55);
  };

  const renderMonthTouchable = () => {
    const arrowIcon = calendarHeight === 55 ? '▼' : '▲'; 
  
    return (
<TouchableOpacity
  style={[styles.monthTouchable, { left: 90, marginTop: 8, }]}
  onPress={toggleCalendarSize}
  activeOpacity={0.8}
>
  <View style={{ justifyContent: 'center', paddingHorizontal: 15 }}>
    <Text style={{ fontSize: 20, color: 'red' }}>{arrowIcon}</Text>
  </View>
</TouchableOpacity>

    );
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        ref={ref}
        onDayPress={day => {
          setSelectedDate(day.dateString);
          setShowModal(true);
        }}
        markedDates={markedDates}
        style={{ height: calendarHeight }} // Lisätty ehto kalenterin koon määrittämiseksi
        headerRender={({ month }) => renderMonthTouchable(month)} // Lisätty kuukauden nimen painettava alue
      />
      {showModal && (
        <Modal
          animationType="none"
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
                  <Text style={styles.goalText}>Amount: {goal.amount}{currencySymbol}</Text>
                </View>
              ))}
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
      {renderMonthTouchable("April")}
    </View>
  );
});

export default CalendarComponent;
