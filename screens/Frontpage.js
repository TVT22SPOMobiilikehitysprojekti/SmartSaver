import React from 'react';
import { View,  StyleSheet,  ScrollView } from 'react-native';
import PieChartComponent from '../components/MyPieChart';
import CalendarComponent from '../components/Calendar';
import CurrentbalanceComponent from '../components/Currentbalance';
import { getCurrentUserId } from '../firebase/Shortcuts';
import WeeklyTransactionList from '../components/WeeklyDetail';



const Frontpage = () => {

  return (
    <View style={styles.container}>
        <ScrollView style={styles.content}>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <CalendarComponent />
        </View>

        {/* CurrentBalance */}
        <View style={styles.balanceInfo}>
          <CurrentbalanceComponent userId={getCurrentUserId()} />
        </View>
        
        {/* PieChart */}
        <View>
          <PieChartComponent />
        </View>

        <View>
         {/* WeeklyTransactionList */}
          <WeeklyTransactionList />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 244,0)',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'transparent',
  },
  iconButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  piggyButton: {
    backgroundColor: 'red',
    borderRadius: 30,
    marginLeft: 20,
    width: 40,
    height: 40,
  },
  addButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    marginRight: 20,
    marginBottom: 20,
    width: 40,
    height: 40,
  },
  iconImage: {
    width: 80,
    height: 80,
    marginLeft: 0,
  },
  iconImageChild: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

});

export default Frontpage;
