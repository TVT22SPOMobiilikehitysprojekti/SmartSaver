import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getUserData, getCurrentUserId } from '../firebase/Shortcuts'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // State for profile image

    useEffect(() => {
        const currentUserID = getCurrentUserId();
        const fetchUserData = async () => {
            try {
                const userData = await getUserData(currentUserID);
              
                const email = userData && userData.email ? userData.email : null;
                const name = userData && userData.name ? userData.name : null;
                const profilePic = userData && userData.profilePic ? userData.profilePic : null; // Assuming profilePic is the key for profile image
                setUserEmail(email);
                setUserName(name);
                setProfileImage(profilePic);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchUserData();
    
        // Cleanup function
        return () => {
            // Cleanup tasks if needed
        };
    }, []);
     
  
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
            <View style={styles.profileIconContainer}>
                <TouchableOpacity onPress={() => {/* Add function to change profile image */}}>
                    <Image 
                        source={profileImage ? { uri: profileImage } : require('../assets/smartsaver_logo.png')} // Provide a default image
                        style={styles.profileIcon} 
                    />
                    <Icon name="pencil" size={20} style={styles.editIcon} />
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
        justifyContent: 'center',
        alignItems: 'left',
        paddingTop: 20,
        
    },
    profileIconContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',

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
        backgroundColor: 'transparent', // Adjust icon's background color as needed
    },
    userInfoContainer: {
        flexDirection: 'column',
        marginVertical: 25,

    },
    userInfoColumn: {
        flexDirection: 'column',
        marginVertical: 15,
        marginLeft: 50,

    },
    icon: {

        marginRight: 10,
    },
    label: {
        fontSize: 20,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ProfilePage;
