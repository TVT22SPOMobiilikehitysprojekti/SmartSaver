import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Icon1 from 'react-native-vector-icons/AntDesign'; 


const BottomBar = ({ activeTab, onPressHome, onPressPlus, onPressPen }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconContainer} onPress={onPressHome}>
          <Icon1 name="home" size={20} color={activeTab === 'home' ? 'blue' : 'grey'} />
          {activeTab === 'home' && <View style={styles.indicator} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={onPressPlus}>
          <Icon1 name="pluscircleo" size={40} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={onPressPen}>
          <Icon name="line-chart" size={20} color={activeTab === 'savings' ? 'blue' : 'grey'} />
          {activeTab === 'savings' && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
       elevation: 5,
    },
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      position: 'relative',
      size: 40,
    },
    indicator: {
      position: 'absolute',
      bottom: -5,
      width: '20%',
      height: 3,
      borderRadius: 5,
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
    },
  });
export default BottomBar;
