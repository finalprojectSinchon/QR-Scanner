import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>AirService</Text>
            <Text style={styles.text}>스캔하세요</Text>

            <TouchableOpacity
                style={styles.scanButton}
                onPress={() => navigation.navigate('QrScanner')}
            >
                <Text style={styles.scanButtonText}>스캔하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F8F8', // Light gray background
        padding: 20,
    },
    header: {
        fontSize: 36,
        fontWeight: '700', // Bold weight
        color: '#333', // Dark gray text
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        color: '#666', // Medium gray text
        marginBottom: 30,
    },
    scanButton: {
        backgroundColor: '#007AFF', // Blue color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3, // Slight shadow
        shadowColor: '#000', // Shadow color
        shadowOpacity: 0.2, // Shadow opacity
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowRadius: 3, // Shadow blur
    },
    scanButtonText: {
        color: '#fff', // White text
        fontSize: 18,
        fontWeight: '600', // Semi-bold weight
    },
});

export default HomeScreen;
