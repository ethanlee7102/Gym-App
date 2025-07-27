import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import PSVnoTitle from '@/components/PSVnoTitle';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { acceptFriendRequest, getFriendRequests } from '../../api/api';
import { useFriendRequests } from '@/context/acceptRequest-context';

export default function TabTwoScreen() {

    const { requests, loading, acceptRequest } = useFriendRequests();
    return (
        
        <PSVnoTitle>
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
        </PSVnoTitle>
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
