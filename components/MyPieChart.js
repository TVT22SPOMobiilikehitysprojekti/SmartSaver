import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const data = [
  {
    name: 'Food',
    amount: 200,
    color: '#FF6384',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Transportation',
    amount: 100,
    color: '#36A2EB',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Entertainment',
    amount: 150,
    color: '#FFCE56',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
  
};
const PieChartComponent = () => {
  const [selectedSlice, setSelectedSlice] = useState({
    label: '',
    value: '',
  });

  const handlePiePress = (data, index) => {
    setSelectedSlice({
      label: data[index].name,
      value: data[index].amount,
    });
  };

  return (
    <View>
      <PieChart
        data={data}
        width={300}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
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
