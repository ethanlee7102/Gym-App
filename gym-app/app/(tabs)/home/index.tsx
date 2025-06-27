import { Pressable, Image, StyleSheet, Platform, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '../../api/api';

export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('../login');
    };
    useEffect(() => {
        const checkToken = async () => { //this checks if there is a token (already logged in)
            const token = await AsyncStorage.getItem('token');
            if (!token) { //if there isnt redirects to the login
                router.replace('../login');
            }
            setLoading(false);
        };

        checkToken();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await getMe();
            setUserInfo(res.data);
        }
    })


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking login...</Text>
            </View>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ParallaxScrollView>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Home</ThemedText>
                </ThemedView>
                <Pressable onPress={logout}>
                    <ThemedText>Logout</ThemedText>
                </Pressable>
                <Pressable onPress={() => router.push('/(tabs)/home/add-post')}>
                <ThemedText>post</ThemedText></Pressable>

            </ParallaxScrollView>

            <Pressable
                style={[styles.floatingButton, { bottom: 85 }]}
                onPress={() => router.push('/stats')}
            >
                <ThemedView style={styles.textWrapper}>
                    <Text style={styles.buttonText}>Level: (lvl)</Text>
                    <Text style={styles.buttonText2}>Title: (title goes here)</Text>
                </ThemedView>
                <ThemedView style={styles.progressBarContainer}>
                    <ThemedView style={styles.progressBarFill} />
                </ThemedView>
            </Pressable>
        </ThemedView>

    );
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    floatingButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#333',
        paddingTop: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'flex-start',
        height: 60,
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonText2: {
        color: 'white',
        fontSize: 14,

    },
    container: {
        flex: 1,
    },
    progressBarContainer: {
        height: 6,
        left: 0,
        width: '100%',
        backgroundColor: '#555',
        overflow: 'hidden',
    },
    textWrapper: {
        paddingLeft: 15,
        paddingBottom: 5,
        backgroundColor: '#333',
        borderTopLeftRadius: 20,
    },
    progressBarFill: {
        width: '75%',  //this should be changed to grow dynamically
        height: '100%',
        backgroundColor: '#4aa8ff',
    },
});
