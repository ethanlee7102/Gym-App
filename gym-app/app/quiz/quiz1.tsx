import { StyleSheet, Image, Platform, Pressable } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import NoTabSV from '@/components/NoTabSV';

export default function TabTwoScreen() {
  return (
    <NoTabSV>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Quiz</ThemedText>
      </ThemedView>

      <Pressable onPress={() => router.push('/(tabs)/home')}>
                      <ThemedText>go to home</ThemedText></Pressable>
      
    </NoTabSV>
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
});
