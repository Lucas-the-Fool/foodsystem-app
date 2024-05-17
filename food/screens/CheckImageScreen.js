import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import request from '../utils/request';

const CheckImageScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction('');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('An error occurred while picking the image.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permissions are required to use this feature.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction('');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('An error occurred while taking the photo.');
    }
  };

  const checkImage = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await request.post('/food_check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Check image response:', response.data);

      if (response.data.code === 200) {
        setPrediction(response.data.pred_name);
      } else {
        Alert.alert('Recognition failed', response.data.message);
      }
    } catch (error) {
      console.error('Error checking image:', error);
      Alert.alert('An error occurred while checking the image.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Image</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={checkImage}>
            <Text style={styles.actionButtonText}>Check Image</Text>
          </TouchableOpacity>

        </View>
      )}
      {prediction && <Text style={styles.prediction}>Prediction: {prediction}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 16,
      },

      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },

    buttonContainer: {
        flexDirection: 'column',
        gap:5,
        marginVertical:10,
     
    },

    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    margin:10
  },
  actionButtonContainer: {
    flexDirection: 'column',
    gap:5,
    marginVertical:10,
  },
  actionButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  prediction: {
    fontSize: 28,
    color: '#333',
    marginTop: 20,
    marginLeft:10,
    fontWeight:'700'
  },
});

export default CheckImageScreen;
