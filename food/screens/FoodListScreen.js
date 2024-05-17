import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import request from '../utils/request';
import imageMap from '../utils/imageMap';

function FoodListScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await request.get(`/foods/${categoryId}/`);
        setFoods(response.data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
   
      <FlatList
        data={foods}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}>
            <View style={styles.foodContainer}>
              <Text style={styles.name}>{item.name}</Text>
          

              <Image
                source={imageMap[item.image]}
                resizeMode="cover"
                style={styles.image}
              />

              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.detailLink}>View Detail</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 16,
    },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 10,
  },
  foodContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  category: {
    fontSize: 14,
    color: 'gray',
  },
  detailLink: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },

  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default FoodListScreen;
