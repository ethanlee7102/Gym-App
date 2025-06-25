import { StyleSheet, Image, Platform, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Dimensions } from 'react-native';

interface UserInfo {
  username: string;
  friends: string[];
}
const screenWidth = Dimensions.get('window').width;

export default function TabTwoScreen() {
  
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Friends</ThemedText>
            <Pressable style={styles.button} onPress={() => router.push('/friends/add-friend')}>
              <ThemedText type='smallSemiBold'>+ Add Friends</ThemedText>
            </Pressable>
      </ThemedView>
 
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
