import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { acceptFriendRequest, getFriendRequests } from '../../api/api';

export default function TabTwoScreen() {

    const [requests, setRequests] = useState<{ username: string }[]>([]);
    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const res = await getFriendRequests(); 
            setRequests(res.data.requests);
          } catch (e) {
            console.error("Failed to fetch requests", e);
          }
        };
        fetchRequests();
      }, []);

    const acceptRequest = async (username: string) => {
    try {
        await acceptFriendRequest(username);
        setRequests(prev => prev.filter(r => r.username !== username));
    } catch (e) {
        console.error("Failed to accept request", e);
    }
    };
    return (
        
        <ParallaxScrollView>
            <ThemedView style={styles.headerWrapper}>

                <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/friends')}>
                    <Ionicons name="chevron-back" size={28} color="white"></Ionicons>
                </Pressable>

                <ThemedView style={styles.titleContainer}>

                    <Pressable onPress={() => router.replace('/friends/add-friend')}>
                        <ThemedText type="greyedSub">Add Friend</ThemedText>
                    </Pressable>

                    <ThemedText type="underlined">Accept Requests</ThemedText>

                </ThemedView>
                <ThemedView style={{ marginTop: 20, width: '90%' }}>
                    <ThemedText type="subtitle">Friend Requests</ThemedText>
                    {requests.length === 0 && (
                        <ThemedText style={{ color: 'gray', marginTop: 10 }}>No pending requests</ThemedText>
                    )}
                    {requests.map((req, idx) => (
                        <ThemedView key={idx} style={styles.requestItem}>
                        <ThemedText style={{ color: 'white' }}>{req.username}</ThemedText>
                        <Pressable style={styles.acceptButton} onPress={() => acceptRequest(req.username)}>
                            <ThemedText style={{ color: 'green' }}>Accept</ThemedText>
                        </Pressable>
                        </ThemedView>
                    ))}
                </ThemedView>

            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        position: 'relative',
        alignItems: 'center',
        paddingTop: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 25
    },
    backButton: {
        position: 'absolute',
        left: -9,
        top: 16,
    },
    requestItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#5E5E5E',
        borderRadius: 5,
        backgroundColor: '#2C2C2C',
      },
      acceptButton: {
        marginLeft: 20,
      }
});
