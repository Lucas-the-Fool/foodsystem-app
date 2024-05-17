import React from 'react';
import { Button, Text, View, StyleSheet,TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

function AccountScreen() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (loggedIn === 'true') {
        setIsLoggedIn(true);
      } 
    };
    checkLoginStatus();
  }, []);

  const goToLogin = () => navigation.navigate('Login');
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Info</Text>
      {isLoggedIn ? (
           <>
           <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
             <Ionicons name="log-out" size={24} color="#007bff" style={styles.icon} />
             <Text style={styles.buttonText}>Log Out</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CheckImage')}>
             <Ionicons name="scan" size={24} color="#007bff" style={styles.icon} />
             <Text style={styles.buttonText}>Check Image</Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('MyLikes')}>
             <Ionicons name="heart" size={24} color="#007bff" style={styles.icon} />
             <Text style={styles.buttonText}>My Likes</Text>
           </TouchableOpacity>


         </>
      ) : (
        <Button
          title="Log In"
          onPress={goToLogin}

        />
      )}
    </View>
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
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap:10,
    alignItems:'center',
    marginVertical:10
    
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight:'600'

  },
});

export default AccountScreen;