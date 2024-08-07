import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
        <Text style={styles.header}>AirService</Text>
      <Text style={styles.text}>스캔하세요</Text>
      <Button
        title="스캔하기"
        onPress={() => navigation.navigate('QrScanner')}
      />
        <Button title="Test" onPress={() => navigation.navigate('InspectionRegist')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
