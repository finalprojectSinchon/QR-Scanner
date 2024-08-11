import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';

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
          AsyncStorage.setItem('token', data.data.Authorization);
          navigation.navigate('Main');
        })
        .catch((error) => {
          console.error('로그인 에러:', error);
          Alert.alert('로그인에 실패하였습니다. 다시 시도해주세요');
        });
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground
              source={{ uri: 'https://i.postimg.cc/g2kVhd2k/view-of-3d-airplane-with-travel-destination-landscape.jpg' }}
              style={styles.backgroundImage}
          >
            <View style={styles.loginBox}>
              {/*<Text style={styles.title}>SkyCare</Text>*/}

              <Image
                  source={{ uri: 'https://github.com/user-attachments/assets/f302bd66-767c-48f1-a097-eb9498feeca9' }}
                  style={styles.logo}
                  alt="logo"
              />

              <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={submitHandler}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.formContainer}>
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

                      <View style={styles.rememberMeContainer}>
                        <Checkbox
                            value={rememberMe}
                            onValueChange={(newValue) => setRememberMe(newValue)}
                        />
                        <Text style={styles.rememberMeText}>로그인 상태 유지</Text>
                      </View>

                      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>로그인하기</Text>
                      </TouchableOpacity>
                    </View>
                )}
              </Formik>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  loginBox: {
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 300,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
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
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginFormik;
