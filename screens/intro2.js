import React, { useState } from 'react';
import Currency from '../components/Currency';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const IntroScreen2 = () => {
  return (
      <View style={styles.container}>
          <Currency />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34a4eb',
    paddingTop: 65,
  }
});

export default IntroScreen2;
