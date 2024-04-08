// Import necessary libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import PieChartComponent from '../components/MyPieChart';
import CalendarComponent from '../components/Calendar';


const Frontpage = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showChildPressables, setShowChildPressables] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const toggleChildPressables = () => {
    setShowChildPressables(!showChildPressables);
  };

  // Example navigation function for a menu item
  const navigateToSavings = () => {
    closeMenu();
    navigation.navigate('Savings');
  };

    return (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>SmartSaver</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.menuDots}>:</Text>
            </Pressable>
          </View>
    
          {/* Calendar */}
          <View style={styles.calendarContainer}>
            <CalendarComponent />
          </View>
    
          {/* Balance Info */}
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceText}>Balanceshowercomponent?</Text>
          </View>
          {/* Balance Info */}
          <View >
            <PieChartComponent />
          </View>    
            {/* Footer with buttons */}
      <View style={styles.footer}>
        <Pressable style={[styles.iconButton, styles.piggyButton]} onPress={() => navigation.navigate('Savings')}>
          <Image
            source={require('../assets/piggy-icon.png')}
            style={styles.iconImage}
          />
        </Pressable>
        <Pressable style={[styles.iconButton, styles.addButton]} onPress={toggleChildPressables}>
          <Image
            source={require('../assets/plus-icon.png')} 
            style={styles.iconImage}
          />
        </Pressable>
        {showChildPressables && (
          <View style={styles.childPressablesContainer}>
            <Pressable style={[styles.iconButton, styles.childButton]} onPress={() => navigation.navigate('transaction')}>
              <Image 
              source={require('../assets/plus-icon.png')} 
              style={styles.iconImage} 
              />
            </Pressable>
            <Pressable style={[styles.iconButton, styles.childButton]} onPress={() => navigation.navigate('addSavings')}>
              <Image 
              source={require('../assets/plus-icon.png')} 
              style={styles.iconImage} 
              />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#EFEFEF',
      },
      headerText: {
        fontSize: 24,
      },
      menuDots: {
        fontSize: 24,
      },
      calendarContainer: {
        // Set your calendar styles
      },
      balanceInfo: {
        padding: 20,
        backgroundColor: '#EFEFEF',
      },
      balanceText: {
        fontSize: 18,
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute', // Position the footer at the bottom
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'transparent', // Set to transparent or your desired color
      },
      iconButton: {
        width: 60, // Set the width & height to make it a circle
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Adds a drop shadow on Android
        shadowOffset: { width: 1, height: 1 }, // Drop shadow for iOS
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      piggyButton: {
        backgroundColor: 'red', // Replace with your desired color
        borderRadius: 30, // Half of the width and height to make it a circle
        marginLeft: 10, // Adjust as necessary
      },
      addButton: {
        backgroundColor: 'green', // Replace with your desired color
        borderRadius: 30, // Half of the width and height to make it a circle
        marginRight: 10, // Adjust as necessary
      },
      iconImage: {
        width: 30, // Size as necessary
        height: 30, // Size as necessary
        resizeMode: 'contain', // Ensures the icon fits without stretching
      },
      childPressablesContainer: {
        position: 'absolute', // Position the child pressables absolutely
        bottom: 80, // Adjust as necessary to position them above the parent button
        flexDirection: 'column', // Change to column to make them appear vertically
        alignItems: 'center', // Center the child buttons horizontally
        width: '184%',
        
      },
      childButton: {
         // Set the width & height to make it a circle
        // Additional styles for child buttons
      },
    });
    

export default Frontpage;
