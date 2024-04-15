import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { firestore, collection, onSnapshot, query, where } from '../firebase/Config';
import { getCurrentUserId } from '../firebase/Shortcuts';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

// Define chart configuration
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 1,
  useShadowColorFromDataset: false,
};

const PieChartComponent = () => {
  // State variables
  const [transactions, setTransactions] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState({ label: '', value: '' });

  // Navigation hook
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch transactions from Firestore
    const currentUserID = getCurrentUserId();
    const q = query(
      collection(firestore, 'Users', currentUserID, 'Transactions'),
      where('isExpense', '==', true)
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempTransactions = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const categoryName = data.category;
        if (tempTransactions[categoryName]) {
          tempTransactions[categoryName].value += data.amount;
        } else {
          tempTransactions[categoryName] = {
            name: categoryName,
            value: data.amount,
          };
        }
      });
      // Convert object to array before setting state
      setTransactions(Object.values(tempTransactions));
    });
  
    return unsubscribe;
  }, []);




  return (
    <View>
      {/* Pie Chart */}
      <TouchableOpacity onPress={() => navigation.navigate('ViewTransactionDetails')}>
        <PieChart
          data={transactions}
          width={Dimensions.get("window").width}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="0"
        />
      </TouchableOpacity>
      {/* Selected slice details */}
      <Text style={{ textAlign: 'center' }} >
       Press PieChart To View Details
      </Text>
    </View>
  );
};

export default PieChartComponent;
