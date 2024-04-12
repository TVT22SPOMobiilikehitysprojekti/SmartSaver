import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Currency from '../components/Currency';

const IntroScreen2 = () => {
  const currencies = [
    { id: 1, name: 'USD - United States Dollar ($)' },
    { id: 2, name: 'EUR - Euro (€)' },
    { id: 3, name: 'JPY - Japanese Yen (¥)' },
    { id: 5, name: 'CNY - Chinese Yuan (¥)' },
    { id: 6, name: 'INR - Indian Rupee (₹)' },
    { id: 7, name: 'AUD - Australian Dollar (A$)' },
    { id: 8, name: 'CAD - Canadian Dollar (C$)' },
    { id: 9, name: 'SGD - Singapore Dollar (S$)' },
    { id: 10, name: 'CHF - Swiss Franc (CHF)' },
    { id: 11, name: 'MYR - Malaysian Ringgit (RM)' },
    { id: 12, name: 'NZD - New Zealand Dollar (NZ$)' },
    { id: 13, name: 'THB - Thai Baht (฿)' },
    { id: 14, name: 'HUF - Hungarian Forint (Ft)' },
    { id: 15, name: 'AED - United Arab Emirates Dirham (د.إ)' },
    { id: 16, name: 'HKD - Hong Kong Dollar (HK$)' },
    { id: 17, name: 'MXN - Mexican Peso (Mex$)' },
    { id: 18, name: 'ZAR - South African Rand (R)' },
    { id: 19, name: 'PHP - Philippine Peso (₱)' },
    { id: 20, name: 'SEK - Swedish Krona (kr)' },
    { id: 21, name: 'IDR - Indonesian Rupiah (Rp)' },
    { id: 22, name: 'SAR - Saudi Riyal (﷼)' },
    { id: 23, name: 'BRL - Brazilian Real (R$)' },
    { id: 24, name: 'TRY - Turkish Lira (₺)' },
    { id: 25, name: 'KES - Kenyan Shilling (KSh)' },
    { id: 26, name: 'KRW - South Korean Won (₩)' },
    { id: 27, name: 'EGP - Egyptian Pound (E£)' },
    { id: 28, name: 'IQD - Iraqi Dinar (ع.د)' },
    { id: 29, name: 'NOK - Norwegian Krone (kr)' },
    { id: 30, name: 'KWD - Kuwaiti Dinar (د.ك)' },
    { id: 31, name: 'RUB - Russian Ruble (₽)' },
    { id: 32, name: 'DKK - Danish Krone (kr)' },
    { id: 33, name: 'PKR - Pakistani Rupee (₨)' },
    { id: 34, name: 'ILS - Israeli New Shekel (₪)' },
    { id: 35, name: 'PLN - Polish Zloty (zł)' },
    { id: 36, name: 'QAR - Qatari Riyal (ر.ق)' },
    { id: 37, name: 'CZK - Czech Koruna (Kč)' },
    { id: 38, name: 'CLP - Chilean Peso (CLP$)' },
    { id: 39, name: 'TWD - New Taiwan Dollar (NT$)' },
    { id: 40, name: 'AED - United Arab Emirates Dirham (د.إ)' },
    { id: 41, name: 'COP - Colombian Peso (COL$)' },
    { id: 42, name: 'ARS - Argentine Peso (ARS$)' },
    { id: 43, name: 'PHP - Philippine Peso (₱)' },
    { id: 44, name: 'VND - Vietnamese Dong (₫)' }
  ];

  const [selectedCurrencyId, setSelectedCurrencyId] = useState(null);

  const handleCurrencyPress = (currency) => {
    setSelectedCurrencyId(currency.id);
    console.log('Selected currency:', currency);
    // Handle the selected currency here
  };

  return (
    <NavigationContainer>
      <Currency
        currencies={currencies}
        selectedCurrencyId={selectedCurrencyId}
        onSelectCurrency={handleCurrencyPress}
      />
    </NavigationContainer>
  );
};

export default IntroScreen2;
