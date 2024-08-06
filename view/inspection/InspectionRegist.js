import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
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
        userCode : '',
        airplaneCode : '',
    });

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
                    const response = await axios.get('http://192.168.0.209:8080/user-info', {
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
                    const response = await axios.get(`http://192.168.0.209:8080/api/v1/qr/${scannedData.facilityName}/${scannedData.facilityId}`, {
                        headers: {
                            Authorization: storedToken
                        }
                    });
                    setLocation(response.data.data);
                    setInspectionInfo(prevInfo => ({
                        ...prevInfo,
                        airplaneCode : scannedData.facilityId
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
                userCode : userInfo.userCode || '',
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
        try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                await axios.post(
                    'http://192.168.0.209:8080/api/v1/qr',
                    inspectionInfo,
                    {
                        headers: {
                            Authorization: storedToken,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                Alert.alert("등록 완료", "점검이 성공적으로 등록되었습니다.");
            } else {
                Alert.alert("토큰 오류", "토큰을 찾을 수 없습니다. 다시 로그인 해주세요.");
            }
        } catch (error) {
            Alert.alert("등록 오류", "점검 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegisterClick}>
                    <Text style={styles.buttonText}>등록</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F5',
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#F8F8F8',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        backgroundColor: '#F8F8F8',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    textarea: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedStatusButton: {
        backgroundColor: '#007AFF',
    },
    statusButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedStatusButtonText: {
        color: '#FFFFFF',
    },
});

export default InspectionRegist;
