import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { updateUserName } from '../firebase/Shortcuts';
import { auth } from '../firebase/Config';
import { useNavigation } from '@react-navigation/native';


const Getuserinfo = () => {
    const [name, setName] = useState('');
    const navigation = useNavigation();

    const handleSaveName = async () => {
        const user = auth.currentUser;
        if (user) {
            updateUserName(user.uid, name).then(() => {
                setName('');
                navigation.navigate('IntroStep2');
            }).catch((error) => {
                Alert.alert("Error", error.message);
            });
        } else {
            Alert.alert("Error", "No user is logged in.");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <Text style={styles.intro}>Welcome to the SmartSaver</Text>
            <Text style={styles.idea}>The idea of the application is simple:{'\n'} just input your income, expenses,{'\n'} and savings goal, and the app takes{'\n'} care of the rest!</Text>
            <Text style={styles.idea}>Firstly we would like to know {'\n'}what we call you?</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSaveName}>
                    <Text style={styles.buttonText}>Save and Get Started!</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,

    },
    idea: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: 'gray',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 300,
        width: '80%',
        position: 'absolute',
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    intro: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Getuserinfo;
