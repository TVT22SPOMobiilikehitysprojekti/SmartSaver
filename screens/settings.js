import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { updateCurrencySymbol } from '../firebase/Shortcuts';
import { getCurrentUserId, fetchCurrencySymbol} from '../firebase/Shortcuts';

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

const SettingsScreen = ({ navigation }) => {

  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [currency, setCurrency] = useState(currencies[1]);
  const userId = getCurrentUserId();
  const [modalVisible, setModalVisible] = useState(false);
  

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

  const handleSelectCurrency = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    setModalVisible(false);
    updateCurrencySymbol(userId, selectedCurrency.symbol, handleSuccess, handleError);
  };

  const handleSuccess = (message) => {
    alert(message);
  };

  const handleError = (error) => {
    alert("Error: " + error.message);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Change currency ({currencySymbol})</Text>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text>Select Currency</Text>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <FlatList
                    data={currencies}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.item} onPress={() => handleSelectCurrency(item)}>
                        <Text style={styles.itemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
          {/* Repeat for other settings */}
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Setting 2</Text>
            <Text style={styles.settingDescription}>Setting 2 description</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Setting 3</Text>
            <Text style={styles.settingDescription}>Setting 3 description</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional settings</Text>
          {/* Repeat for other settings */}
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Setting 4</Text>
            <Text style={styles.settingDescription}>Setting 4 description</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Setting 5</Text>
            <Text style={styles.settingDescription}>Setting 5 description</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerIcon: {
    fontSize: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#EFEFEF',
    padding: 10,
  },
  settingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SettingsScreen;
