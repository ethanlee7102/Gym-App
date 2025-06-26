import { useEffect } from 'react';
import { router } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { StyleSheet } from 'react-native';
import NoTabSV from '@/components/NoTabSV';

export default function RootRedirect() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1000); // 1 second

    return () => clearTimeout(timer);
  }, []);

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