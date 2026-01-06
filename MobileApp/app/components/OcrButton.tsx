
import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import OcrService from '../services/OcrService';
import type { TicketData } from '../services/OcrService';

interface OcrButtonProps {
  onDataExtracted: (data: TicketData) => void;
  style?: any;
  title?: string;
}

const OcrButton: React.FC<OcrButtonProps> = ({ onDataExtracted, style, title = 'Scan Ticket' }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permissions are required to scan the ticket.');
      return;
    }

    // Launch camera
    console.log('Launching camera with options:', {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsProcessing(true);
      try {
        const imageUri = result.assets[0].uri;
        const parsedData = await OcrService.processTicketImage(imageUri);
        onDataExtracted(parsedData);
        Alert.alert('Success', 'Ticket data extracted successfully!');
      } catch (error) {
        // Extract the detailed error message
        let errorMessage = 'Failed to process the ticket image. Please try again.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        Alert.alert('Error', errorMessage);
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} style={style} disabled={isProcessing}>
      {isProcessing ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default OcrButton;
