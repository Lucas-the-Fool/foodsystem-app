import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet,TextInput, Button,Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import request from '../utils/request';
import imageMap from '../utils/imageMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker'

const FoodDetailScreen = () => {
    const route = useRoute();
    const { foodId } = route.params;
    console.log(foodId);


    const [food, setFood] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [rating,setRating] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoodDetail = async () => {
            try {
                const response = await request.get(`/foods/detail/${foodId}`);
                console.log(response.data);
                setFood(response.data.food);
                setComments(response.data.comments);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFoodDetail();
    }, [foodId]);

    const handleAddComment = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            console.log({
                content: commentText,
                food_id: foodId,
                user_id: userId
            });
            const response = await request.post('/add_comment/', {
                content: commentText,
                food_id: foodId,
                user_id:userId
            });

            if (response.data.code === 200) {
            
                setComments([...comments, {
                    id: response.data.id, 
                    user: 'Anonymous', 
                    create_time: new Date().toISOString(), 
                    content: commentText,
                }]);
              
                setCommentText('');
   
                Alert.alert('Success', 'Comment added successfully!');
            } else {

                Alert.alert('Error', 'Failed to add comment. Please try again later.');
            }
        } catch (error) {

            Alert.alert('Error', 'Failed to add comment. Please try again later.');
            console.error('Error adding comment:', error);
        }
    };

      const handleAddLike = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          await request.post(`/add_like/`, {
            user_id:userId,
            food_id: foodId,
          }),

          console.log(userId,foodId);
          Alert.alert('Success', 'Like added successfully!');

        } catch (error) {
          Alert.alert('Error', 'Failed to add like. Please try again later.');
          console.error('Error adding like:', error);
        }
      };
    
      const handleRateFood = async (score) => {
        const userId = await AsyncStorage.getItem('userId');
        try {
          await request.post('/input_score/', {
            score: rating,
            user_id:userId,
            food_id: foodId,
          });
          Alert.alert('Success', 'Rating submitted successfully!');
      
        } catch (error) {
          Alert.alert('Error', 'Failed to submit rating. Please try again later.');
          console.error('Error submitting rating:', error);
        }
      };

    return (
        <ScrollView style={styles.container}>
            {food && (
                <View style={styles.foodContainer}>
                    <Text style={styles.title}>{food.name}</Text>
                    <Text style={styles.info}>Category: {food.category}</Text>
                 
                    <Image
                        source={imageMap[food.image]}
                        resizeMode="cover"
                        style={styles.foodImage}
                    />
                    <Text style={styles.content}>{food.content}</Text>
                </View>
            )}

            {comments.length > 0 && (
                <View style={styles.commentContainer}>
                    <Text style={styles.commentTitle}>Comment List</Text>
                    {comments.map((comment) => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.authorInfo}>{comment.user} - {new Date(comment.create_time).toLocaleString()}</Text>
                            <Text style={styles.commentText}>{comment.content}</Text>
                        </View>
                    ))}
                </View>
            )}


            <View style={styles.addCommentContainer}>
                <Text style={styles.commentTitle}>Add Comment</Text>
                <TextInput
                style={styles.commentInput}
                multiline
                placeholder="Type your comment here..."
                value={commentText}
                onChangeText={setCommentText}
                />
                <Button title="Add Comment" onPress={handleAddComment} />
            </View>


            <View style={styles.likeContainer}>
                <Button title="Like" onPress={handleAddLike} color={'green'}/>
            </View>


            <View style={styles.ratingContainer}>
                <Text>Select Rating:</Text>
                <Picker
                    selectedValue={rating}
                    style={{ height: 50, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                        setRating(itemValue)
                    }>
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                    <Picker.Item label="5" value={5} />
                </Picker>
                <Button title="Rate" onPress={handleRateFood} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        padding: 10,
    },
    foodContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
 
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    
    },
    foodImage: {
        width: '100%',
        height: 200,
        borderRadius: 10, 
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        textAlign: 'justify', 
    },
    commentContainer: {
        marginBottom: 20,
    },
    commentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
     
    },
    comment: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    commentText: {
        fontSize: 16,
      },
    authorInfo: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'justify',
    },

    addCommentContainer: {
        marginBottom: 20,
      },
      commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
      },
      center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      errorText: {
        color: 'red',
        fontSize: 16,
      },
      likeContainer: {
        marginBottom: 20,
      },
      ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom:30
    },
});

export default FoodDetailScreen;
