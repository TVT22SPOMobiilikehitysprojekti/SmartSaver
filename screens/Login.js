import React, {useState} from 'react';
import { StyleSheet, Button, Text, TextInput, View, SafeAreaView } from "react-native";
import Constants from 'expo-constants';
import { getAuth , signInWithEmailAndPassword} from '../firebase/Config';


export default function Login({navigation, setLogin}){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSignIn = () => {
        signInWithEmailAndPassword(getAuth(), username, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User signed in:', user);
                navigation.navigate('SmartSaver');
                // Add navigation logic here to navigate to the next screen
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Error signing in:', errorMessage);
                // Handle error message display or any other actions
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={username}
                    onChangeText={(text) => setUserName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Button title="Sign In" onPress={handleSignIn} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
