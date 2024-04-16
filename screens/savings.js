import React from 'react';
import { View, StyleSheet } from 'react-native';
import SavingsShow from '../components/SavingsShow';

const Savings = () => {
  return (
    <View style={styles.container}>
      <SavingsShow />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default Savings;
