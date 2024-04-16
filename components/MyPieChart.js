import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
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
  
    const availableColors = [
      '#FF5733', // Red
      '#FFC300', // Yellow
      '#C70039', // Maroon
      '#900C3F', // Dark Magenta
      '#581845', // Dark Red
      '#00CED1', // Dark Turquoise
      '#4682B4', // Steel Blue
      '#8A2BE2', // Blue Violet
      '#228B22', // Forest Green
      '#FF8C00', // Dark Orange
      '#9932CC', // Dark Orchid
      '#6A5ACD', // Slate Blue
      '#4169E1', // Royal Blue
      '#4B0082', // Indigo
      '#20B2AA', // Light Sea Green
      '#DC143C', // Crimson
      '#2E8B57', // Sea Green
      '#FF1493', // Deep Pink
      '#8B4513', // Saddle Brown
      '#8B0000'  // Dark Red
    ]; 
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempTransactions = {};
      let colorIndex = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const categoryName = data.category;
        if (tempTransactions[categoryName]) {
          tempTransactions[categoryName].value += data.amount;
        } else {
          let color = availableColors[colorIndex];
          colorIndex = (colorIndex + 1) % availableColors.length; // Cycle through colors
          tempTransactions[categoryName] = {
            name: categoryName,
            value: data.amount,
            color: color,
          };
        }
      });
      // Convert object to array before setting state
      setTransactions(Object.values(tempTransactions));
    });
  
    return unsubscribe;
  }, []);




  return (
    <View style={styles.container}>
      {/* Pie Chart */}
      <TouchableOpacity onPress={() => navigation.navigate('ViewTransactionDetails')}>
        <PieChart
          data={transactions}
          width={Dimensions.get("window").width}
          height={230}
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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 25 ,
  },
});

export default PieChartComponent;
