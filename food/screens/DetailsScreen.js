import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import useCates from '../hooks/useCates';

function DetailsScreen({ navigation }) {
  const { data, isLoading, error } = useCates();

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
        <Text style={styles.errorText}>Error loading categories</Text>
      </View>
    );
  }

  const navigateToCategory = (categoryId) => {
    navigation.navigate('FoodList', { categoryId });
  };

  return (
    <View style={styles.container}>
 
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToCategory(item.id)}>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{item.name}</Text>
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
  categoryContainer: {
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
  categoryText: {
    fontSize: 18,
    color: '#333',
  },

  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DetailsScreen;
