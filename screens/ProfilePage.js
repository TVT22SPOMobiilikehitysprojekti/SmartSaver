import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { getUserData, getCurrentUserId, saveImageUriToDatabase } from '../firebase/Shortcuts'; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileImageURL, setProfileImageURL] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
            setModalVisible(false); 
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
            setModalVisible(false); 
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="times" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
                            <Icon name="camera" size={24} color="white" />
                            <Text style={styles.modalButtonText}>Take a Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleChooseFromLibrary}>
                            <Icon name="image" size={24} color="white" />
                            <Text style={styles.modalButtonText}>Choose from Library</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.profile}>
            <View style={styles.profileIconContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image 
                        source={profileImageURL ? { uri: profileImageURL } : require('../assets/smartsaver_logo.png')} 
                        style={styles.profileIcon} 
                        onError={() => setProfileImageURL(null)} 
                    />
                    <Icon name="pencil" size={20} style={styles.editIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.userInfoContainer}>
            <Icon name="user" size={20} style={styles.icon} />
                <View style={styles.userInfoColumn}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{userName}</Text>
                </View>
                <Icon name="envelope" size={20} style={styles.icon} />
                <View style={styles.userInfoColumn}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{userEmail}</Text>
                </View>
            </View>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34a4eb',
        height: '100%',
        width: '100%',

    },
    profile: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 20,
        elevation: 5,
        minWidth: 300,
  
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',

    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalButton: {
        backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    profileIconContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 20,
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
    icon:{
        fontSize: 35,
    },
    userInfoContainer: {
        flexDirection: 'column',
        marginVertical: 25,
        width: '100%',
        
    },
    userInfoColumn: {
        flexDirection: 'column',
        marginVertical: 15,
        marginLeft:50,
        top: -65,
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
