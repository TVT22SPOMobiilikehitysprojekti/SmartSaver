
import React, {useState} from 'react';
import {Calendar, } from 'react-native-calendars';


const CalendarComponent = () => {
  const [selected, setSelected] = useState('');

  const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
const workout = {key: 'workout', color: 'green'};

  

  return (
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        '2012-05-16': {selected: true, marked: true, selectedColor: 'blue'},
        '2012-05-17': {marked: true},
        '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
        '2012-05-19': {disabled: true, disableTouchEvent: true}
      }}
    />
  );
};

export default CalendarComponent;