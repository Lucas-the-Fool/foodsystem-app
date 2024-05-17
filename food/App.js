import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FoodListScreen from './screens/FoodListScreen';
import CheckImageScreen from './screens/CheckImageScreen'; // 导入 CheckImageScreen
import { Ionicons } from '@expo/vector-icons';
import FoodDetailScreen from './screens/FoodDetailScreen ';
import MyLikes from './screens/MyLikes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Details') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Details" component={DetailsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodList"
          component={FoodListScreen}
          options={{ title: 'Food List' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: 'Details' }}
        />

        <Stack.Screen
          name="FoodDetail"
          component={FoodDetailScreen}
          options={{ title: 'Food Detail' }}
        />

        <Stack.Screen
          name="MyLikes"
          component={MyLikes}
          options={{ title: 'My Likes' }}
        />


        <Stack.Screen
          name="CheckImage"
          component={CheckImageScreen}
          options={{ title: 'Check Image' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;