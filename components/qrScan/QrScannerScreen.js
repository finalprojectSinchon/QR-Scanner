import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const QrScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    // 여기에서 데이터를 사용하여 필요한 작업을 수행할 수 있습니다.
    alert(`스캔 완료: ${data}`);
    navigation.navigate('Home'); // 스캔 후 홈으로 돌아갑니다.
  };

  if (hasPermission === null) {
    return <Text>카메라 권한 요청 중...</Text>;
  }
  if (hasPermission === false) {
    return <Text>카메라 권한이 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'다시 스캔'} onPress={() => setScanned(false)} />}
      <Text style={styles.scannedData}>{scannedData}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedData: {
    position: 'absolute',
    bottom: 100,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default QrScannerScreen;
