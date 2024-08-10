import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const WebViewForQR = () => {
    const openBrowser = async () => {
        let result = await WebBrowser.openBrowserAsync('http://localhost:5713');
        // 브라우저가 닫힐 때 result로 결과를 받을 수 있습니다.
    };

    return (
        <View style={styles.container}>
            <Button title="Open QR Scanner" onPress={openBrowser} />
        </View>
    );
};

const styles = StyleSheet.com.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default WebViewForQR;