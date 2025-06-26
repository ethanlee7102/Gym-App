import { StyleSheet, Image, Platform, Pressable, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { sendFriendRequest, getSentFriendRequests } from '../../api/api';

// interface UserInfo {
//     sentRequests: { username: string }[];
// }

export default function TabTwoScreen() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sentRequests, setSentRequests] = useState<{ username: string }[]>([]);
    

    const sendRequest = async () => {
        setError('');
        setSuccess('');
        try{
            const sendRequestRes = await sendFriendRequest(username.trim());
            setSuccess(`Friend request sent to ${username}`);
            setUsername('');
        }catch(e){
            setError('Failed to send request');
        }
    }

    useEffect(() => {
        const fetchSentRequests = async () => {
          try {
            const res = await getSentFriendRequests();
            setSentRequests(res.data.sentRequests);
          } catch (e) {
            console.error('Failed to fetch sent requests', e);
          }
        };
      
        fetchSentRequests();
      }, []);

    
    return (

        <ParallaxScrollView>
            <ThemedView style={styles.headerWrapper}>

                <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/friends')}>
                    <Ionicons name="chevron-back" size={28} color="white"></Ionicons>
                </Pressable>

                <ThemedView style={styles.titleContainer}>

                    <ThemedText type="underlined">Add Friend</ThemedText>

                    <Pressable onPress={() => router.replace('/friends/friend-request')}>
                        <ThemedText type="greyedSub">Accept Requests</ThemedText>
                    </Pressable>

                </ThemedView>

                <TextInput
                    style={styles.input}
                    placeholder = "Add Friend With Their Username"
                    placeholderTextColor="#535050"
                    value = {username}
                    onChangeText={setUsername}
                />

                <Pressable style={styles.requestButton}onPress={sendRequest}>
                    <ThemedText type='defaultSemiBold'>Send Friend Request</ThemedText>
                </Pressable>
                {error ? <ThemedText style={{ color: 'red' }}>{error}</ThemedText> : null}
                {success ? <ThemedText style={{ color: 'green' }}>{success}</ThemedText> : null}    

               
                <ThemedView style={{ marginTop: 20 }}>
                    <ThemedText type="subtitle">Sent Requests</ThemedText>
                    {sentRequests.length === 0 && (
                        <ThemedText style={{ color: 'gray', marginTop: 10 }}>No pending requests</ThemedText>
                    )}
                    {sentRequests.map((req, idx) => (
                    <ThemedText key={idx} style={{ color: 'white', marginTop: 5 }}>
                        {req.username}
                    </ThemedText>
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
    input:{
        backgroundColor: '#1C1C1C',
        borderColor: '#5E5C5C',
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: 40,
        marginBottom: 10,
        marginTop: 40,
        color: 'white',
        
    },
    requestButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        paddingVertical: 9,
        backgroundColor: '#373737',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,
        
        maxWidth: 200,
    },
});
