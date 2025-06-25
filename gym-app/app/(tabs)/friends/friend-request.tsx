import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Ionicons } from '@expo/vector-icons';
import { acceptFriendRequest, getFriendRequests } from '../../api/api';

export default function TabTwoScreen() {

    const acceptRequest = async () => {

    }
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
});
