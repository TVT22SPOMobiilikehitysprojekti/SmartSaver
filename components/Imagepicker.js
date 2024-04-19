import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveImageUriToDatabase } from '../firebase/Shortcuts';
import { auth } from '../firebase/Config';

const ImagePickerComponent = () => {
    const [imageUri, setImageUri] = useState(null);
  
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
            setImageUri(cropResult.assets[0].uri);
            await saveImageUriToDatabase(auth.currentUser.uid, cropResult.assets[0].uri);
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
                setImageUri(cropResult.assets[0].uri);
                await saveImageUriToDatabase(auth.currentUser.uid, cropResult.assets[0].uri);
              }
      };
  
      return (
        <View style={styles.addpicturecontainer}>
        <View>
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, borderRadius: 100, }} />}
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleChooseFromLibrary}>
            <Text style={styles.buttonText}>Choose from Library</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
  };
      
      const styles = StyleSheet.create({
        addpicturecontainer: {
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 30,
          elevation: 5,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          marginBottom: 70,
        },
        button: {
          margin: 10,
          padding: 10,
          backgroundColor: 'lightgray',
          alignItems: 'center',
          borderRadius: 5
        },
        buttonText: {
          color: 'black',
          fontSize: 16 // Tekstin koko
        }
      });

export default ImagePickerComponent;
