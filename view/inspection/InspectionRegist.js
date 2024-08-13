import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    ActivityIndicator,
    Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const InspectionRegist = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { scannedData } = route.params || {};
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const [location, setLocation] = useState({});
    const [inspectionInfo, setInspectionInfo] = useState({
        manager: '',
        status: '정상',
        location: '',
        text: '',
        type: '',
        regularInspectionDate: '',
        phone: '',
        userCode: '',
        airplaneCode: '',
    });
    const [loading, setLoading] = useState(false);  // 로딩 상태 추가

    const scrollViewRef = useRef(null);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchTokenAndUserInfo = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    const response = await axios.get('http://skycare.site:8080/user-info', {
                        headers: {
                            Authorization: storedToken
                        }
                    });
                    setUserInfo(response.data.data);
                } else {
                    Alert.alert(
                        "Token Error",
                        "No token found. Please log in again.",
                        [{ text: "OK" }]
                    );
                }
            } catch (error) {
                Alert.alert(
                    "Token Error",
                    "Error fetching user info. Please try again.",
                    [{ text: "OK" }]
                );
            }
        };

        const fetchTokenLocation = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    const response = await axios.get(`http:/skycare.site:8080/api/v1/qr/${scannedData.facilityName}/${scannedData.facilityId}`, {
                        headers: {
                            Authorization: storedToken
                        }
                    });
                    setLocation(response.data.data);
                    setInspectionInfo(prevInfo => ({
                        ...prevInfo,
                        airplaneCode: scannedData.facilityId
                    }));
                } else {
                    Alert.alert(
                        "Token Error",
                        "No token found. Please log in again.",
                        [{ text: "OK" }]
                    );
                }
            } catch (error) {
                Alert.alert(
                    "Token Error",
                    "Error fetching user info. Please try again.",
                    [{ text: "OK" }]
                );
            }
        };

        fetchTokenAndUserInfo();
        fetchTokenLocation();
    }, [scannedData]);

    useEffect(() => {
        if (userInfo) {
            setInspectionInfo(prevInfo => ({
                ...prevInfo,
                manager: userInfo.userName || '',
                phone: userInfo.userPhone || '',
                userCode: userInfo.userCode || '',
            }));
        }
    }, [userInfo]);

    useEffect(() => {
        if (location) {
            setInspectionInfo(prevInfo => ({
                ...prevInfo,
                location: location.location
            }));
        }
    }, [location]);

    useEffect(() => {
        if (scannedData) {
            setInspectionInfo(prevInfo => ({
                ...prevInfo,
                status: scannedData.status || '정상',
                text: scannedData.text || '',
                type: scannedData.facilityName || '타입이 없습니다.',
                regularInspectionDate: getCurrentDate()
            }));
        }
    }, [scannedData]);

    const onChangeHandler = (name, value) => {
        setInspectionInfo({
            ...inspectionInfo,
            [name]: value,
        });
    };

    const handleRegisterClick = async () => {
        setLoading(true);  // 로딩 시작

        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                await axios.post(
                    'http://skycare.site:8080/api/v1/qr',
                    inspectionInfo,
                    {
                        headers: {
                            Authorization: storedToken,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                Alert.alert("등록 완료", "점검이 성공적으로 등록되었습니다.");
                navigation.navigate('Main')
            } else {
                Alert.alert("토큰 오류", "토큰을 찾을 수 없습니다. 다시 로그인 해주세요.");
            }
        } catch (error) {
            Alert.alert("등록 오류", "점검 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);  // 로딩 종료
        }
    };

    const StatusButton = ({ title, isSelected, onPress }) => (
        <TouchableOpacity
            style={[styles.statusButton, isSelected && styles.selectedStatusButton]}
            onPress={onPress}
        >
            <Text style={[styles.statusButtonText, isSelected && styles.selectedStatusButtonText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    ref={scrollViewRef}
                >
                    <Text style={styles.title}>안전 점검 등록</Text>

                    <View style={styles.card}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="안전점검 할 위치를 입력하세요"
                                value={inspectionInfo.location}
                                onChangeText={(value) => onChangeHandler('location', value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Status</Text>
                            <View style={styles.statusButtonContainer}>
                                <StatusButton
                                    title="정상"
                                    isSelected={inspectionInfo.status === '정상'}
                                    onPress={() => onChangeHandler('status', '정상')}
                                />
                                <StatusButton
                                    title="점검중"
                                    isSelected={inspectionInfo.status === '점검중'}
                                    onPress={() => onChangeHandler('status', '점검중')}
                                />
                                <StatusButton
                                    title="중단"
                                    isSelected={inspectionInfo.status === '중단'}
                                    onPress={() => onChangeHandler('status', '중단')}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Type</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="타입을 입력하세요"
                                value={inspectionInfo.type}
                                onChangeText={(value) => onChangeHandler('type', value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Manager</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="이름을 입력하세요"
                                value={inspectionInfo.manager}
                                onChangeText={(value) => onChangeHandler('manager', value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Regular Inspection Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="점검일을 기입하세요. EX)202X-XX-XX"
                                value={inspectionInfo.regularInspectionDate}
                                onChangeText={(value) =>
                                    onChangeHandler('regularInspectionDate', value)
                                }
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="EX)010-****-****"
                                maxLength={13}
                                value={inspectionInfo.phone}
                                onChangeText={(value) => onChangeHandler('phone', value)}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>비고</Text>
                            <TextInput
                                style={[styles.input, styles.textarea]}
                                placeholder="특이사항을 입력하세요"
                                multiline
                                numberOfLines={6}
                                value={inspectionInfo.text}
                                onChangeText={(value) => onChangeHandler('text', value)}
                                onFocus={() => {
                                    setTimeout(() => {
                                        scrollViewRef.current.scrollToEnd({ animated: true });
                                    }, 300);
                                }}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleRegisterClick}>
                            <Text style={styles.buttonText}>등록</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* 로딩 모달 */}
                <Modal
                    transparent={true}
                    visible={loading}
                    onRequestClose={() => setLoading(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Image
                                source={require('../../assets/loading.gif')}
                                style={styles.loadingImage}
                            />
                            <Text style={styles.loadingText}>보고서 생성중입니다...</Text>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollContainer: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
    },
    textarea: {
        height: 120,
        textAlignVertical: 'top',
    },
    statusButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    selectedStatusButton: {
        backgroundColor: '#007AFF',
    },
    statusButtonText: {
        color: '#333',
        textAlign: 'center',
    },
    selectedStatusButtonText: {
        color: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 150,
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingImage: {
        width: 100,
        height: 100,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default InspectionRegist;
