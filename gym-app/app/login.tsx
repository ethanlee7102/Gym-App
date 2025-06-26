import React, { useState } from 'react';
import {StyleSheet, ScrollView, Pressable, Text, View, TextInput} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { login, register } from './api/api';
import NoTabSV from '@/components/NoTabSV';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';
import { useUser } from '@/context/user-context';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { refetchUser } = useUser();

    const handleLogin = async () => {
        try{
            const logRes = await login(username, password);
            await AsyncStorage.setItem('token', logRes.data.token);
            await refetchUser();
            router.replace('/(tabs)/home');
        }catch(e){
            setError("Login Failed")
        }
    }

    const handleRegister = async () => {
        try{
            await register(username, password);
            handleLogin();
        }catch(e){
            setError("Registration Failed")
        }
    }   

    return(
        <NoTabSV>
            <Image
                source={require('@/assets/images/dumbell.png')} // adjust path as needed
                style={[styles.dumbell, { tintColor: 'white' }]}
                resizeMode="contain"
            />
            <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Login To GymApp</ThemedText>
            </ThemedView>
            
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                    style={styles.input}
                    placeholder = "Username"
                    placeholderTextColor="gray"
                    value = {username}
                    onChangeText={setUsername}
                    />
                    <TextInput
                    secureTextEntry={true}
                    style={styles.input}
                    placeholder = "Password"
                    placeholderTextColor="gray"
                    value = {password}
                    onChangeText={setPassword}
                    
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable 
                    style={styles.loginButton}
                    onPress={handleLogin}
                    >
                        <ThemedText type='defaultSemiBold'>Login</ThemedText>
                    </Pressable>
                    <Pressable 
                    style={styles.registerButton}
                    onPress={handleRegister}
                    >
                        <ThemedText type='defaultSemiBold'>Register</ThemedText>
                    </Pressable>
                </View>
                {error ? <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text> : null}
            </View>
        </NoTabSV>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 50,
    },
    container:{
        paddingTop:45,
        marginTop: 0,
        padding: 30,
        flex:1,
        backgroundColor: '#373737',
        borderRadius: 10,
        borderColor: '#AFAFAF',
        borderWidth: 3
    },
    inputContainer: {
        alignItems: 'center',
        
    },
    input:{
        backgroundColor: '#1C1C1C',
        borderColor: '#AFAFAF',
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        width: '100%',
        maxWidth: 400,
        marginBottom: 10,
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 10,
        padding: 0,
        width: '100%',
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto',
    },
    loginButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        paddingVertical: 9,
        backgroundColor: '#1C1C1C',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,
        
        maxWidth: 200,
    },
    registerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        paddingVertical: 9,
        backgroundColor: '#1C1C1C',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,
        maxWidth: 200,
    },
    dumbell: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginTop: 20,
      },
})
