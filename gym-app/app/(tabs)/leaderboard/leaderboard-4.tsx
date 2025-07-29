import { StyleSheet, Image, Platform, View, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getDotsLeaderboard } from '@/app/api/api';

export default function TabTwoScreen() {

    type LeaderboardUser = {
        _id: string;
        username: string;
        profilePicture?: string;
        dots: number;
        DOTSrank: string;
    };
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const res = await getDotsLeaderboard();
                setLeaderboard(res.data);
            } catch (err) {
                console.error('Failed to load leaderboard', err);
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);
    return (
        <ParallaxScrollView header={
            <View style={styles.titleContainer}>
                <ThemedText type="title">Leaderboard4</ThemedText>
            </View>
        }>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-1')}>
                    <ThemedText type='smallSemiBold'>Streaks</ThemedText>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-2')}>
                    <ThemedText type='smallSemiBold'>Level</ThemedText>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-3')}>
                    <ThemedText type='smallSemiBold'>ELO?</ThemedText>
                </Pressable>
                <Pressable style={styles.buttonSelected} onPress={() => router.push('/leaderboard/leaderboard-4')}>
                    <ThemedText type='smallSemiBold'>DOTS</ThemedText>
                </Pressable>
            </View>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                leaderboard.map((item, index) => (
                    <ThemedView key={item._id} style={styles.itemContainer}>
                        <ThemedText style={styles.rankText}>#{index + 1}</ThemedText>
                        <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
                        <View style={styles.infoContainer}>
                            <ThemedText style={styles.username}>{item.username}</ThemedText>
                            <ThemedText style={styles.dots}>{item.dots.toFixed(2)}</ThemedText>
                        </View>
                    </ThemedView>
                ))
            )}

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingTop: 10,
    },


    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    rankText: {
        width: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    infoContainer: {
        flexDirection: 'column',
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    dots: {
        fontSize: 14,
        color: '#aaa',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 0,

        backgroundColor: '#373737',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,

        width: 80,
        height: 30
    },
    buttonSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 0,

        backgroundColor: '#919191ff',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,

        width: 80,
        height: 30
    },
});
