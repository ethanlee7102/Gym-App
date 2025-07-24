import { useEffect } from 'react';
import { router } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';
import NoTabSV from '@/components/NoTabSV';
import { useUser } from '@/context/user-context'; 
import { useFeed } from '@/context/feed-context';
import HomeScreen from './(tabs)/home'; 

export default function RootRedirect() {
  const { loading: userLoading } = useUser();
  const { loading: feedLoading } = useFeed();
  useEffect(() => {
    if (!userLoading && !feedLoading) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [userLoading, feedLoading]);

  return (
    <NoTabSV>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Loading my Shiz</ThemedText>
      </ThemedView>
    </NoTabSV>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
  },
});