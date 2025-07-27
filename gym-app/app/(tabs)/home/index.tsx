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
import dayjs from 'dayjs';


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

    const handleCheckin = async () => {
        try{
            
        } catch(e){

        }
    }


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
            <Pressable
                onPress={() => router.push('/(tabs)/home/add-post')}
                style={styles.floatingAddButton}
            >
                <Text style = {{color: '#bdbdbdff'}}>＋</Text>
            </Pressable>

            <ParallaxScrollView header = {
                <View style={styles.titleContainer}>
                    <ThemedText type="title">Home</ThemedText>
                </View>
            } onScroll={({ nativeEvent }) => {
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

                 <View style={styles.card}>
                <ThemedText >Good Afternoon {user?.username}!</ThemedText>
                <ThemedText >Today is Friday, 4/18/25,</ThemedText>
                <ThemedText >LEG DAY</ThemedText>

                <View style={styles.divider} />

                <View style={styles.bottomRow}>
                    <View style={styles.halfSection}>
                        <View style={styles.streakContainer}>
                        <Image
                            source={require('@/assets/images/fire.webp')} // replace with your flame icon
                            style={styles.flameIcon}
                        />
                        <ThemedText >{user?.streak}</ThemedText>
                        <ThemedText>DAY STREAK</ThemedText>
                        </View>
                    </View>

                     <View style={styles.verticalDivider} />

                    <View style={styles.halfSection}>
                        <Pressable style={styles.checkInButton}>
                            <ThemedText style={styles.checkInText}>I worked</ThemedText>
                            <ThemedText style={styles.checkInText}>out today!</ThemedText>
                        </Pressable>
                    </View>
                </View>
                </View>
                
                                
                {feedPosts.map((post, idx) => (
                    <View key={idx} style={styles.postContainer}>
                        <ThemedView style={styles.postHeaderContainer}>
                            <Image
                                source={{ uri: post.userId.profilePicture }}
                                style={styles.profilePictures}
                            />
                            <ThemedView style={styles.postHeader}>
                                <ThemedText style={{ fontWeight: 'bold' , lineHeight: 17}}>{post.userId.username}</ThemedText>
                                <ThemedText style={{ fontSize: 11, color: '#999', lineHeight: 10 }}>
                                    {dayjs(post.createdAt).format('MMM D [at] h:mm A')}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={styles.postContentContainer}>
                            <ThemedText style={styles.captionContainer}>{post.caption}</ThemedText>
                            {post.imageUrl !== '' && (
                                <Image 
                                    source={{ uri: post.imageUrl }} 
                                    style={styles.postImage} 
                                    contentFit="cover"
                                    transition={200} 
                                />
                            )}
                        </ThemedView>
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
    floatingAddButton: {
        position: 'absolute',
        bottom: '17%', // adjust as needed to not overlap with tab bar or other buttons
        right: '4%',
        backgroundColor: '#474747ff',
        width: 70,
        height: 70,
        borderRadius: 100,
        borderColor: '#bdbdbdff',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
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
        color: '#bebcbcff',
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
    postContainer: {
        backgroundColor: '#191919ff',
        marginBottom: 1,
        marginHorizontal: -27,
        paddingLeft: 20, 
        paddingRight: 40,
        paddingTop: 10,
        paddingBottom: 15
    },
    postHeaderContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 5, 
        backgroundColor: '#191919ff',
    },
    postHeader: {
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        backgroundColor: '#191919ff',
        marginLeft: 5
    },
    profilePictures: {
        width: 30, 
        height: 30, 
        borderRadius: 20, 
        marginRight: 8
    },
    postImage: {
        width:  100,
        height:  100,
        borderRadius: 5,
    },
    captionContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    postContentContainer: {
        backgroundColor: '#191919ff',
        flexDirection: 'row',
    },

    card: {
        backgroundColor: '#101010ff',
        borderRadius: 16,
        padding: 20,
        borderColor: '#333',
        borderWidth: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    streakContainer: {
        alignItems: 'center',
        flex: 1,
    },
    flameIcon: {
        width: 40,
        height: 40,
        marginBottom: 2,
    },

    checkInButton: {
        backgroundColor: '#2b2b2b',
        borderColor: '#999',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginLeft: 10,
        alignItems: 'center',
    },
    checkInText: {
        color: 'white',
        fontWeight: '600',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#333',
        height: '100%',
        marginHorizontal: 10,
    },
    halfSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
