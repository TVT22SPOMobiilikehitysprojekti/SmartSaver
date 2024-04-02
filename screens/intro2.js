import React from 'react';
import { View, Text, FlatList } from 'react-native';

const IntroScreen2 = () => {
  const currencies = [
    { id: 1, name: 'USD' },
    { id: 2, name: 'EUR' },
    { id: 3, name: 'GBP' },
    // muokataan myöhemmin
  ];

  return (
    <View>
      <Text>Let’s go step by step!</Text>
      <Text>Step 1: What currency do you use? (Can be changed later in settings)</Text>
      <FlatList
        data={currencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default IntroScreen2;
