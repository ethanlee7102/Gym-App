import React, { useState } from 'react';
import {StyleSheet, ScrollView, Pressable, Text, View, TextInput} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { login, register } from './api/api';
import NoTabSV from '@/components/NoTabSV';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try{
            const logRes = await login(username, password);
            await AsyncStorage.setItem('token', logRes.data.token);
            router.replace('/');
        }catch(e){
            setError("Login Failed")
        }
    }

    const handleRegister = async () => {
        try{
            console.log(" tried to reg1 ")
            await register(username, password);
            console.log(" tried to reg ")
            handleLogin();
        }catch(e){
            setError("Registration Failed")
        }
    }   

    return(
        <NoTabSV>
            <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Login</ThemedText>
            </ThemedView>
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
                    <Text>Login</Text>
                </Pressable>
                <Pressable 
                style={styles.registerButton}
                onPress={handleRegister}
                >
                    <Text >Register</Text>
                </Pressable>
            </View>
            {error ? <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text> : null}

            <Pressable onPress={() => router.push('/')}><ThemedText>Login</ThemedText></Pressable>
        </NoTabSV>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container:{
        flex:1,
        backgroundColor: 'white',
    },
    inputContainer: {
        alignItems: 'center',
    },
    input:{
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        width: '100%',
        maxWidth: 400,
        marginBottom: 10,
        
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 0,
        padding: 10,
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
        paddingVertical: 13,
        backgroundColor: 'grey',
        margin: 5,
        
        maxWidth: 120,
    },
    registerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        paddingVertical: 13,
        backgroundColor: 'grey',
        margin: 5,
        maxWidth: 120,
    }
})
