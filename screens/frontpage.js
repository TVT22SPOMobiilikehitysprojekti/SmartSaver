import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const Frontpage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SmartSaver</Text>
        <Pressable onPress={() => {}}>
          <Text style={styles.menuDots}>::::</Text>
        </Pressable>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Placeholder for your calendar component */}
      </View>

      {/* Balance Info */}
      <View style={styles.balanceInfo}>
        <Text style={styles.balanceText}>Balance on Apr 1: €0.00</Text>
      </View>

      {/* Footer with buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.iconButton}>
          <Text>/SAVINGS/</Text>
        </Pressable>
        <Pressable style={styles.addButton}>
            <Text>/ADD/</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34a4eb',
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
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  iconButton: {
    // Style your icon button
  },
  addButton: {
    // Style your add button
  },
});

export default Frontpage;
