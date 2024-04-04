import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Menu, IconButton } from 'react-native-paper'; // Import IconButton from react-native-paper

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SmartSaver</Text>
        <TouchableOpacity onPress={openMenu}>
          <View style={styles.menuIconContainer}>
            <Text style={styles.menuIcon}>.</Text>
            <Text style={styles.menuIcon}>.</Text>
            <Text style={styles.menuIcon}>.</Text>
          </View>
        </TouchableOpacity>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Text style={{ display: 'none' }}></Text>}
        >
          <Menu.Item onPress={() => {}} title="Add savings goal" />
          <Menu.Item onPress={() => {}} title="Add expense/income" />
        </Menu>
      </View>
      <View style={styles.body}>
        <Calendar
          // Add any calendar props you need here
        />
      </View>
      <TouchableOpacity style={styles.plusButton} onPress={openMenu}>
        <IconButton icon="plus" color="white" size={30} />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0, // Adjust the top padding according to your preference
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 390,
    height: 100,
    marginBottom: 20,
    backgroundColor: '#16C7FF',
    paddingHorizontal: 10,
  },
  headerText: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  menuIconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 30,
  },
  menuIcon: {
    color: 'black',
    fontWeight: 'bold',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightgreen',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
});
 