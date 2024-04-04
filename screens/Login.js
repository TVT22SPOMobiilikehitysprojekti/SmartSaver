import { StyleSheet, Button, Text, TextInput, View, SafeAreaView } from "react-native";
import Constants from 'expo-constants';
import {getAuth, signInWithEmailAndPassword} from './firebase/Config'

export default function Login(){
    const {username, setUserName} = useState('test1@foo.com')
    const {password, setPassword} = useState('test123')

}