import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 여기에 로그인 로직을 추가합니다.
    if (email === 'test@example.com' && password === 'password') {
      Alert.alert('로그인 성공', '로그인되었습니다.');
      navigation.navigate('Home');
    } else {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default LoginScreen;
