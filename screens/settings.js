import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SettingsScreen = ({ navigation }) => {
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
            <Text style={styles.settingTitle}>Change currency (€)</Text>
            <Text style={styles.settingDescription}>
              Select the currency you want to use
            </Text>
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
