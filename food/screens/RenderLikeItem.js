import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import request from '../utils/request';
import imageMap from '../utils/imageMap';

const RenderLikeItem = ({ item, navigation }) => {
    const [food, setFood] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const response = await request.get(`/foods/detail/${item.food}`);
                if (response.data) {
                    setFood(response.data.food);
                    setIsLoading(false);
                } else {
                    setError('Failed to fetch food details');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching food details:', error);
                setError('Failed to fetch food details');
                setIsLoading(false);
            }
        };

        fetchFoodDetails();
    }, [item.food]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#0000ff" />
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

    if (!food) {
        return null;
    }

    return (
        <TouchableOpacity style={styles.foodContainer} onPress={() => navigation.navigate('FoodDetail', { foodId: food.id })}>
    
            <Image
                source={imageMap[food.image]}
                resizeMode="cover"
                style={styles.image}
              />
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.category}>Category: {food.category}</Text>
            <Text style={styles.detailLink}>See details</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: 'black',
        marginTop: 5,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
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

export default RenderLikeItem;
