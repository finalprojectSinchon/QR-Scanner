import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WebView } from 'react-native-webview';
import LoginScreen from './view/login/LoginScreen';
import HomeScreen from './view/home/HomeScreen';
import QrScannerScreen from "./components/qrScan/QrScannerScreen";
import InspectionRegist from "./view/inspection/InspectionRegist";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeWebView = () => (
    <WebView
        source={{ uri: 'http://192.168.0.209:5173/' }}
        style={{ flex: 1 }}
    />
);

function MainTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="QR 인증" component={HomeScreen} />
            <Tab.Screen name="홈" component={HomeWebView} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="Main"
                    component={MainTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="QrScanner" component={QrScannerScreen} />
                <Stack.Screen name="안전점검" component={InspectionRegist} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}