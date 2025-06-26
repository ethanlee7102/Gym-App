import { StyleSheet, Image, Platform, Pressable, Text, } from 'react-native';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { getMe } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';


interface UserInfo {
    username: string;
}

const screenWidth = Dimensions.get('window').width;

export default function TabTwoScreen() {
    const screenWidth = Dimensions.get('window').width;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('../login');
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await getMe();
            setUserInfo(res.data);
        }
        fetchUserInfo();
    })
    if (!userInfo) {
        return <Text style={{ color: 'white' }}>Loading...</Text>;
    }
    return (
        <ParallaxScrollView>
            <ThemedView style={styles.profileContainer}>
                <Ionicons name="add-circle" size={98} color="#D9D9D9" style={{ marginLeft: screenWidth * -0.03 }}></Ionicons>
                <ThemedView style={styles.unContainer}>
                    <ThemedText type="subtitle">{userInfo.username}</ThemedText>
                    <ThemedText type="greyed">Custom Title (edit)</ThemedText>

                </ThemedView>
                <Ionicons name="cog" size={38} color="#D9D9D9" style={styles.settingsButton}></Ionicons>


            </ThemedView>
            <Pressable onPress={logout}>
                <ThemedText>Logout</ThemedText>
            </Pressable>


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    settingsButton: {
        paddingTop: screenWidth * 0.04,
        marginLeft: 'auto',
    },
    unContainer: {
        paddingTop: 20,
        paddingLeft: 25,
        flexDirection: 'column',
        gap: 1,
    },
    profileContainer: {
        flexDirection: 'row',
        gap: 1,
    }
});
