import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { firestore, collection, onSnapshot, query, where } from '../firebase/Config';
import { getCurrentUserId } from '../firebase/Shortcuts';
import { useNavigation } from '@react-navigation/native'; 

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 1,
  useShadowColorFromDataset: false,
  tooltipLabel: ({ index, item }) => `${item.name}: $${item.value.toFixed(2)}`,
};

const PieChartComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const navigation = useNavigation();

  useEffect(() => {
    const currentUserID = getCurrentUserId();
    const q = query(
      collection(firestore, 'Users', currentUserID, 'Transactions'),
      where('isExpense', '==', true)
    );
    const availableColors = [
      '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845', '#00CED1', '#4682B4', '#8A2BE2', '#228B22', '#FF8C00',
      '#9932CC', '#6A5ACD', '#4169E1', '#4B0082', '#20B2AA', '#DC143C', '#2E8B57', '#FF1493', '#8B4513', '#8B0000'
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
          colorIndex = (colorIndex + 1) % availableColors.length; 
          tempTransactions[categoryName] = {
            name: categoryName,
            value: data.amount,
            color: color,
          };
        }
      });

      const sortedTransactions = Object.values(tempTransactions).sort((a, b) => b.value - a.value);
      setTransactions(sortedTransactions);
      setIsLoading(false); 
    });
  
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.piechartheader}>Pie Chart</Text>
      {isLoading ? ( 
        <Text>Loading...</Text>
      ) : transactions.length === 0 ? ( 
        <Text style={{paddingTop: 75, justifyContent: 'center', alignContent: 'center'}}>No transactions available.</Text>
      ) : (
        <>
          {/* Pie Chart */}
          <TouchableOpacity onPress={() => navigation.navigate('ViewTransactionDetails')}>
            <PieChart
              data={transactions}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height / 3.4}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="20"
            />
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', color:'grey'}} >Press to view details</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  piechartheader: {
    color: 'blue',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default PieChartComponent;
