import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getUserData, getCurrentUserId } from '../firebase/Shortcuts'; 

const ProfilePage = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const currentUserID = getCurrentUserId();
        const fetchUserData = async () => {
            try {
                const userData = await getUserData(currentUserID);
                // Assuming userData is an object with an email field
                const email = userData && userData.email ? userData.email : null;
                setUserEmail(email);
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
  
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error: {error}</Text>
            </View>
        );
    }
  
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {userEmail !== null ? (
                <View>
                    <Text>User Email:</Text>
                    <Text>{userEmail}</Text>
                </View>
            ) : (
                <Text>No user email available</Text>
            )}
        </View>
    );
};

export default ProfilePage;
