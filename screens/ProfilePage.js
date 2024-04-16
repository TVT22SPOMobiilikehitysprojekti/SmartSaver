import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUserData, getCurrentUserId, saveImageUriToDatabase } from '../firebase/Shortcuts'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUserID = getCurrentUserId();
                const userData = await getUserData(currentUserID);
                const email = userData && userData.email ? userData.email : null;
                const name = userData && userData.name ? userData.name : null;
                const profilePicURL = userData && userData.imageUrl ? userData.imageUrl : null;
                setUserEmail(email);
                setUserName(name);
                setProfileImageURL(profilePicURL);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleUpdateProfilePic = async (source) => {
        setProfileImageURL(source.uri);
        await saveImageUriToDatabase(getCurrentUserId(), source.uri);
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission required", "Camera permission is required to take photos");
            return;
        }
      
        const cropResult = await ImagePicker.launchCameraAsync({
            mediaType: 'photo',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
            
        if (!cropResult.cancelled && cropResult.assets.length > 0) {
            handleUpdateProfilePic(cropResult.assets[0]);
        }
    };

    const handleChooseFromLibrary = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Storage permission is required to access the library");
            return;
        }
      
        const cropResult = await ImagePicker.launchImageLibraryAsync({
            mediaType: 'photo',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
                
        if (!cropResult.cancelled && cropResult.assets.length > 0) {
            handleUpdateProfilePic(cropResult.assets[0]);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
                <Image 
                    source={profileImageURL ? { uri: profileImageURL } : require('../assets/smartsaver_logo.png')} 
                    style={styles.profileIcon} 
                    onError={() => setProfileImageURL(null)} 
                />
        <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleChooseFromLibrary}>
                    <Text style={styles.buttonText}>Choose from Library</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.userInfoContainer}>
                <View style={styles.userInfoColumn}>
                    <Icon name="user" size={20} style={styles.icon} />
                    <Text style={styles.label}>User Name:</Text>
                    <Text style={styles.value}>{userName}</Text>
                </View>
                <View style={styles.userInfoColumn}>
                    <Icon name="envelope" size={20} style={styles.icon} />
                    <Text style={styles.label}>User Email:</Text>
                    <Text style={styles.value}>{userEmail}</Text>
                </View>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    editIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    userInfoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    userInfoColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ProfilePage;
