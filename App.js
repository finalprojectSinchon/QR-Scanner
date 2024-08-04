import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './view/login/LoginScreen';
import HomeScreen from './view/home/HomeScreen';
import QrScannerScreen from "./components/qrScan/QrScannerScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="QrScanner" component={QrScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
