import React, { useState } from 'react';
import { View, Image, Button, Alert } from 'react-native';
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
      <View>
        {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
        <Button title="Take Photo" onPress={handleTakePhoto} />
        <Button title="Choose from Library" onPress={handleChooseFromLibrary} />
      </View>
    );
  };

export default ImagePickerComponent;
