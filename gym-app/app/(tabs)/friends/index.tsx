import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMe } from '../../api/api';
import { useUser } from '@/context/user-context';

interface UserInfo {
  username: string;
  friends: Friend[];
}

interface Friend {
  username: string;
}

const screenWidth = Dimensions.get('window').width;

export default function TabTwoScreen() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { user, loading } = useUser();
  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const res = await getMe();
  //       setUserInfo(res.data);
  //     } catch (e) {
  //       console.error('Failed to load user info', e);
  //     }
  //   };
  
  //   fetchUserInfo();
  // }, []);
  if (loading) return <ThemedText style={{ color: 'white' }}>Loading...</ThemedText>;
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Friends</ThemedText>
            <Pressable style={styles.button} onPress={() => router.push('/friends/add-friend')}>
              <ThemedText type='smallSemiBold'>+ Add Friends</ThemedText>
            </Pressable>
      </ThemedView>

      {user?.friends?.length ? (
    <ThemedView style={{ marginTop: 20 }}>
      
      {user.friends.map((friend, idx) => (
        <ThemedText key={idx} style={{ color: 'white', marginTop: 5 }}>
          {friend.username}
        </ThemedText>
      ))}
    </ThemedView>
      ) : (
        <ThemedText style={{ marginTop: 20, color: 'gray' }}>
          No friends yet.
        </ThemedText>
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
    paddingTop: 10,
    
 
  },
  buttonContainer: {
    paddingTop: 10,
    marginLeft: screenWidth * 0.2,
    backgroundColor: 'white'
  },
  button: {
    marginTop: screenWidth * 0.032,
    marginLeft: 'auto',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 0,
   
    backgroundColor: '#373737',
    borderColor: '#AFAFAF',
    borderWidth: 1,
    margin: 5,
    
    maxWidth: 105,
    maxHeight:30,
},
});
