import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getUserEmail } from '../firebase/Shortcuts'; 

const ProfilePage = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getUserEmail(userId);
        setUserInfo(user);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserInfo();

    // Cleanup function
    return () => {
      // Cleanup tasks 
    };
  }, [userId]); // Run effect only when userId changes

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
      {userInfo ? (
        <View>
          <Text>User Email: {userInfo.email}</Text>
          {/* Render other user info here */}
        </View>
      ) : (
        <Text>No user info available</Text>
      )}
    </View>
  );
};

export default ProfilePage;
