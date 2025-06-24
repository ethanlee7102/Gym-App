import {Pressable, Image, StyleSheet, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
  <ThemedView style={styles.container}>
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Home</ThemedText>
      </ThemedView>
     
    </ParallaxScrollView>
        
      <Pressable
        style={[styles.floatingButton, { bottom: 85 }]}
        onPress={() => router.push('/stats')}
      >
        <ThemedView style={styles.textWrapper}>
        <Text style={styles.buttonText}>Level: (lvl)</Text>
        <Text style={styles.buttonText2}>Title: (title goes here)</Text>
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
    height: 6,
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
