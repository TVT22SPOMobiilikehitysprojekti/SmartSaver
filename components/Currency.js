import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, FlatList, View, Alert, SafeAreaView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {saveCurrencySymbol, getCurrentUserId} from '../firebase/Shortcuts';


const currencies = [
  { id: 1, name: 'USD - United States Dollar ($)', symbol: '$' },
  { id: 2, name: 'EUR - Euro (€)', symbol: '€' },
  { id: 3, name: 'JPY - Japanese Yen (¥)', symbol: '¥' },
  { id: 5, name: 'CNY - Chinese Yuan (¥)', symbol: '¥' },
  { id: 6, name: 'INR - Indian Rupee (₹)', symbol: '₹' },
  { id: 7, name: 'AUD - Australian Dollar (A$)', symbol: 'A$' },
  { id: 8, name: 'CAD - Canadian Dollar (C$)', symbol: 'C$' },
  { id: 9, name: 'SGD - Singapore Dollar (S$)', symbol: 'S$' },
  { id: 10, name: 'CHF - Swiss Franc (CHF)', symbol: 'CHF' },
  { id: 11, name: 'MYR - Malaysian Ringgit (RM)', symbol: 'RM' },
  { id: 12, name: 'NZD - New Zealand Dollar (NZ$)', symbol: 'NZ$' },
  { id: 13, name: 'THB - Thai Baht (฿)', symbol: '฿' },
  { id: 14, name: 'HUF - Hungarian Forint (Ft)', symbol: 'Ft' },
  { id: 15, name: 'AED - United Arab Emirates Dirham (د.إ)', symbol: 'د.إ' },
  { id: 16, name: 'HKD - Hong Kong Dollar (HK$)', symbol: 'HK$' },
  { id: 17, name: 'MXN - Mexican Peso (Mex$)', symbol: 'Mex$' },
  { id: 18, name: 'ZAR - South African Rand (R)', symbol: 'R' },
  { id: 19, name: 'PHP - Philippine Peso (₱)', symbol: '₱' },
  { id: 20, name: 'SEK - Swedish Krona (kr)', symbol: 'kr' },
  { id: 21, name: 'IDR - Indonesian Rupiah (Rp)', symbol: 'Rp' },
  { id: 22, name: 'SAR - Saudi Riyal (﷼)', symbol: '﷼' },
  { id: 23, name: 'BRL - Brazilian Real (R$)', symbol: 'R$' },
  { id: 24, name: 'TRY - Turkish Lira (₺)', symbol: '₺' },
  { id: 25, name: 'KES - Kenyan Shilling (KSh)', symbol: 'KSh' },
  { id: 26, name: 'KRW - South Korean Won (₩)', symbol: '₩' },
  { id: 27, name: 'EGP - Egyptian Pound (E£)', symbol: 'E£' },
  { id: 28, name: 'IQD - Iraqi Dinar (ع.د)', symbol: 'ع.د' },
  { id: 29, name: 'NOK - Norwegian Krone (kr)', symbol: 'kr' },
  { id: 30, name: 'KWD - Kuwaiti Dinar (د.ك)', symbol: 'د.ك' },
  { id: 31, name: 'RUB - Russian Ruble (₽)', symbol: '₽' },
  { id: 32, name: 'DKK - Danish Krone (kr)', symbol: 'kr' },
  { id: 33, name: 'PKR - Pakistani Rupee (₨)', symbol: '₨' },
  { id: 34, name: 'ILS - Israeli New Shekel (₪)', symbol: '₪' },
  { id: 35, name: 'PLN - Polish Zloty (zł)', symbol: 'zł' },
  { id: 36, name: 'QAR - Qatari Riyal (ر.ق)', symbol: 'ر.ق' },
  { id: 37, name: 'CZK - Czech Koruna (Kč)', symbol: 'Kč' },
  { id: 38, name: 'CLP - Chilean Peso (CLP$)', symbol: 'CLP$' }
];

const Currency = () => {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);
  const navigation = useNavigation();

  const handleCurrencySelect = (currency) => {
    const userId = getCurrentUserId();
    if (userId) {
        saveCurrencySymbol(userId, currency.symbol,
            () => {
                setSelectedCurrencyId(currency.id); // Päivitä valittu valuutta-ID
                setTimeout(() => {
                navigation.navigate('Intro3'); 
              }, 1000);
            },
            (error) => {
                Alert.alert("Error", error.message);
            }
        );
    } else {
        Alert.alert("Error", "No user is logged in.");
    }
};




return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.headerContainer}>
    <Text style={styles.title}>Let's go step by step!</Text>
    <Text style={styles.step}>Step 1: What currency do you use?</Text>
    <Text style={styles.subtext}>(Can be changed later in settings)</Text>
    </View>
    <View style={styles.listContainer}>
    <FlatList
      style={styles.list}
      data={currencies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handleCurrencySelect(item)}
          style={[
            styles.currencyItem,
            item.id === selectedCurrencyId ? styles.selected : {}
          ]}
        >
          <Text style={styles.text}>{item.name}</Text>
        </Pressable>
      )}
      
    />
  </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#34a4eb', // Or whatever color the mockup has for the area behind the list
  },
  headerContainer: {
    backgroundColor: '#34a4eb', // Or another color, matching the mockup
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  step: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 5,
    marginLeft:10,
  },
  subtext: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius:25,
    paddingTop: 10,
    // For iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // For Android shadow
    elevation: 5,
    padding:30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    
  },
  currencyItem: {
    borderBottomWidth: 2,
    borderBottomColor: 'black', // Black color for the line under each currency text
  },

  text: {
    color: '#333333',
    fontSize: 22,
    textAlign: 'center',
    padding: 13,
  },
  selected: {
    backgroundColor: '#00A4CC',
  },
});

export default Currency;
