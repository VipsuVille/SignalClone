import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar';
import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddChatScreen from './screens/AddChatScreen';
import ChatScreen from './screens/ChatScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const globalSreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED"},
  headerTitleStyle: { color: "white"},
  headerTintColor: "white",
};



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      // initialRouteName='Home' 
      screenOptions={{globalSreenOptions}}>
        <Stack.Screen options={{title: "Signal",}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{title: "Lets Register!",}} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{title: "Lets Register!",}} name="Home" component={HomeScreen} />
        <Stack.Screen name="AddChat" component={AddChatScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
