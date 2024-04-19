import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Calendar } from 'react-native-calendars';
import { fetchSavingsGoals, fetchCurrencySymbol, getCurrentUserId, handleCurrencySymbolChange } from '../firebase/Shortcuts';
import { auth } from '../firebase/Config';
import { View, Modal, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';

const CalendarComponent = forwardRef((props, ref) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedGoals, setSelectedGoals] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('');
  let unsubscribeCurrencySymbol;
  const [calendarHeight, setCalendarHeight] = useState(14); // Lisätty kalenterin korkeus
  const calendarRef = useRef(null);


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
    setCalendarHeight(prevHeight => prevHeight === 14 ? 320 : 14);
  };

  const calendarTheme = {
    'stylesheet.calendar.header': {
      week: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: 32,
        textAlign: 'center',
        fontSize: 14,
        color: '#5E60CE',
      },
    },
    'stylesheet.day.basic': {
      selected: {
        backgroundColor: '#5E60CE',
        borderRadius: 16,
      },
      today: {
        backgroundColor: '#dfdfdf',
        borderRadius: 16,
      },
    },
    arrowColor: 'red',
    monthTextColor: 'black',
    indicatorColor: 'red',
  };
  



  const renderMonthTouchable = () => {
    const arrowIcon = calendarHeight === 14 ? '▼' : '▲';



    return (
      <TouchableOpacity
        style={[styles.monthTouchable, { left: 72, marginTop: 12, }]}
        onPress={toggleCalendarSize}
        activeOpacity={0.8}
      >
        <View style={{ justifyContent: 'center', paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 14, color: 'red' }}>{arrowIcon}</Text>
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
        headerRender={() => renderMonthTouchable()} // Lisätty kuukauden nimen painettava alue
        theme={calendarTheme}
        style={{
          ...styles.calendarStyle,
          height: calendarHeight
        }}
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
      {renderMonthTouchable()}
    </View>
  );
});

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
  calendarContainer: {
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 40,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  monthTouchable: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  dayText: {
    fontSize: 16,
    color: 'black',
  },
  todayContainer: {
    backgroundColor: 'blue',
  },
  todayText: {
    color: 'white',
  },
});

export default CalendarComponent;
