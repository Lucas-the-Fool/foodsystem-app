import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import useFoods from '../hooks/useFoods';
import * as FileSystem from 'expo-file-system';
import imageMap from '../utils/imageMap';
const screenWidth = Dimensions.get('window').width;

// 预定义静态图片路径



function HomeScreen({ navigation }) {
  const { data: hotFoods, isLoading, isError } = useFoods();


  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading data</Text>;
  }

  // 获取图片 URI
  const getImageUri = (imageName) => {
    return `${FileSystem.documentDirectory}${imageName}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Deeper and healthier</Text>
      {hotFoods?.map(foodDetail => (
        <View key={foodDetail.food.id} style={styles.foodCard}>
          <View style={styles.foodImageContainer}>
            {imageMap[foodDetail.food.image] ? (
              <Image
                source={imageMap[foodDetail.food.image]}
                resizeMode="cover"
                style={styles.foodImage}
              />
            ) : (
              <Image
                source={{ uri: getImageUri(foodDetail.food.image) }}
                resizeMode="cover"
                style={styles.foodImage}
              />
            )}
          </View>
          <View style={styles.textContent}>
            <Text style={styles.category}>{foodDetail.food.category}</Text>
            <Text style={styles.name}>{foodDetail.food.name}</Text>
            <Text style={styles.content}>{foodDetail.food.content}</Text>
            <Text style={styles.views}>Views: {foodDetail.food.view_count}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  foodCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodImage: {
    width: screenWidth / 3,
    height: screenWidth / 3,
    borderRadius: 8,
  },
  textContent: {
    flex: 1,
    padding: 16,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  views: {
    fontSize: 12,
    color: '#999',
  },
  foodImageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

export default HomeScreen;


