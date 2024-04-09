import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { firestore, collection, TRANSACTIONS, onSnapshot, query, auth, where} from '../firebase/Config'; // Import Firebase firestore



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
  const [transactions, setTransactions] = useState([]);
  const [selectedSlice, setSelectedSlice] = useState({ label: '', value: '' });

  useEffect(() => {
    const currentUserID = 'jF1r0K3rcsfU9L9bRXgcgYURpnX2';

    const q = query(collection(firestore, TRANSACTIONS), where('userID', '==', currentUserID));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempTransactions = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempTransactions.push({
          name: data.Category,
          value: data.Amount,
          color: data.Color,
        });
      });
      
      setTransactions(tempTransactions);
    });
  
    return unsubscribe;
  }, []);

  const handlePiePress = (data, index) => {
    setSelectedSlice({
      label: data[index].name,
      value: data[index].amount,
    });
  };

  return (
    <View>
<PieChart
  data={transactions}
  width={300}
  height={220}
  chartConfig={chartConfig}
  accessor="value"
  backgroundColor="transparent"
  paddingLeft="15"
  absolute
  style={{ marginVertical: 8 }}
  onDataPointClick={({ data, dataIndex }) => handlePiePress(data, dataIndex)}
/>
      <Text style={{ textAlign: 'center' }}>
        {selectedSlice.label ? `${selectedSlice.label}: $${selectedSlice.value}` : 'Click on a slice to view details'}
      </Text>
    </View>
  );
};

export default PieChartComponent;
