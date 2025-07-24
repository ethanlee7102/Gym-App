import { Pressable, StyleSheet, Platform, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFeed } from '../../api/api';
import { useUser } from '@/context/user-context';
import { useFeed } from '@/context/feed-context';


export default function HomeScreen() {

    
    const [loggingin, setLoading] = useState(true);
    const scrollCooldownRef = useRef<number | null>(null);
    const { posts: feedPosts, loading: feedLoading, fetchMore, hasMore } = useFeed();
    
    
    
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

    

    const { user, loading } = useUser();

    


    if (loggingin) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking login...</Text>
            </View>
        );
    }

    if (loading) return <ThemedText>Loading...</ThemedText>;

    return (
        <ThemedView style={styles.container}>
            <ParallaxScrollView onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                const isNearBottom =
                layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

                if (isNearBottom && !scrollCooldownRef.current) {
                    fetchMore();
              
                    
                    scrollCooldownRef.current = setTimeout(() => {
                      scrollCooldownRef.current = null;
                    }, 100);
                }
            }}
            scrollEventThrottle={16}>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Home</ThemedText>
                </ThemedView>
                <Pressable onPress={() => router.push('/(tabs)/home/add-post')}>
                <ThemedText>post</ThemedText></Pressable>
            
                {feedPosts.map((post, idx) => (
                    <View key={idx} style={{ marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Image
                            source={{ uri: post.userId.profilePicture }}
                            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
                        />
                        <ThemedText style={{ fontWeight: 'bold' }}>{post.userId.username}</ThemedText>
                        </View>
                        {/* <ThemedText style={{ fontWeight: 'bold' }}>{post.userId.username}</ThemedText> */}
                        <Image 
                            source={{ uri: post.imageUrl }} 
                            style={{ width: '100%', height: 200, borderRadius: 10 }} 
                            contentFit="cover"
                            transition={200} 
                        />
                        <ThemedText>{post.caption}</ThemedText>
                    </View>
                ))}

            </ParallaxScrollView>

            <Pressable
                style={[styles.floatingButton, { bottom: 85 }]}
                onPress={() => router.push('/stats')}
            >
                <ThemedView style={styles.textWrapper}>
                    <Text style={styles.buttonText}>Level: {user?.level}</Text>
                    <Text style={styles.buttonText2}>Title: {user?.title}</Text>
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
        height: 7,
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
