import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import request from '../utils/request';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RenderLikeItem from './RenderLikeItem'; // 引入 RenderLikeItem

function MyLikes({ navigation }) {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyLikes = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const response = await request.post('/my_like/', { user_id: userId });
                if (response.data.code === 200) {
                    setLikes(response.data.likes);
                    setIsLoading(false);
                } else {
                    setError(response.data.message);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error fetching my likes:', error);
                setError('Failed to fetch my likes. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchMyLikes();
    }, []);

    if (isLoading) {
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
        <View style={styles.listContainer}>
            <FlatList
                data={likes}
                renderItem={({ item }) => <RenderLikeItem item={item} navigation={navigation} />} // 传递 navigation 给 RenderLikeItem
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        padding: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default MyLikes;
