import React from 'react';
import { Pressable, StyleSheet, Text, FlatList } from 'react-native';

const Currency = ({ currencies, selectedCurrencyId, onSelectCurrency }) => {
  const handleCurrencyPress = (currency) => {
    onSelectCurrency(currency);
  };

  return (
    <FlatList
      style={styles.list}
      data={currencies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => handleCurrencyPress(item)} style={({ pressed }) => [styles.currencylines, { opacity: pressed ? 0.5 : 1 }]}>
          <Text style={[styles.currencylist, selectedCurrencyId === item.id && styles.selectedCurrency]}>{item.name}</Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    borderRadius: 15,
    width: '80%',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  currencylines: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  currencylist: {
    marginTop: 5,
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  selectedCurrency: {
    fontWeight: 'bold',
  },
});

export default Currency;
