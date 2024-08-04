import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, CheckBox } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Cookies from 'js-cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginFormik = () => {
  const navigation = useNavigation();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadRememberMe = async () => {
      const state = await AsyncStorage.getItem('rememberMe');
      setRememberMe(state === 'true');
    };
    loadRememberMe();
  }, []);

  const initialValues = {
    userId: '',
    userPassword: '',
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (rememberMe) {
        const userId = await AsyncStorage.getItem('userId');
        const userPassword = await AsyncStorage.getItem('userPassword');
        initialValues.userId = userId || '';
        initialValues.userPassword = userPassword || '';
      }
    };
    loadUserData();
  }, [rememberMe]);

  const validationSchema = Yup.object().shape({
    userId: Yup.string().required('아이디는 반드시 입력해야합니다.'),
    userPassword: Yup.string()
        .min(8, '비밀번호는 8글자 이상을 입력해야합니다.')
        .required('비밀번호는 반드시 입력해야합니다.'),
  });

  const submitHandler = async (fields) => {
    if (rememberMe) {
      await AsyncStorage.setItem('userId', fields.userId);
      await AsyncStorage.setItem('userPassword', fields.userPassword);
      await AsyncStorage.setItem('rememberMe', 'true');
    } else {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userPassword');
      await AsyncStorage.removeItem('rememberMe');
    }

    axios.post('http://192.168.0.20:8080/login', fields, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
        .then(res => res.data)
        .then((data) => {
          Cookies.set('token', data.data.Authorization, { expires: 1 });
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error('로그인 에러:', error);
          Alert.alert('로그인에 실패하였습니다. 다시 시도해주세요');
        });
  };

  return (
      <View style={styles.loginBox}>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.container}>
                <Text style={styles.label}>ID</Text>
                <TextInput
                    style={[
                      styles.input,
                      errors.userId && touched.userId ? styles.errorInput : null,
                    ]}
                    onChangeText={handleChange('userId')}
                    onBlur={handleBlur('userId')}
                    value={values.userId}
                    placeholder="Enter your ID"
                    placeholderTextColor="#888"
                />
                {touched.userId && errors.userId && <Text style={styles.error}>{errors.userId}</Text>}

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[
                      styles.input,
                      errors.userPassword && touched.userPassword ? styles.errorInput : null,
                    ]}
                    secureTextEntry
                    onChangeText={handleChange('userPassword')}
                    onBlur={handleBlur('userPassword')}
                    value={values.userPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#888"
                />
                {touched.userPassword && errors.userPassword && <Text style={styles.error}>{errors.userPassword}</Text>}

                {/*<View style={styles.rememberMeContainer}>*/}
                {/*  <CheckBox*/}
                {/*      value={rememberMe}*/}
                {/*      onValueChange={setRememberMe}*/}
                {/*      tintColors={{ true: '#841584', false: '#ccc' }}*/}
                {/*  />*/}
                {/*  <Text style={styles.rememberMeText}>Remember me</Text>*/}
                {/*</View>*/}

                <Button onPress={handleSubmit} title="Login" color="#841584" />
              </View>
          )}
        </Formik>
      </View>
  );
};

const styles = StyleSheet.create({
  loginBox: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // 배경색을 추가하여 더 깔끔한 느낌
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rememberMeText: {
    marginLeft: 8,
    color: '#333',
  },
});

export default LoginFormik;
