import { StyleSheet, Image, Platform, Pressable } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import NoTabSV from '@/components/NoTabSV';
import { useQuiz } from '@/context/quiz-context';

export default function TabTwoScreen() {
  const { quiz } = useQuiz();

  return (
    <NoTabSV>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Submission</ThemedText>
      </ThemedView>

       <ThemedView>
        <ThemedText>Gender: {quiz.gender || 'Not set'}</ThemedText>
        <ThemedText>Weight: {quiz.weight || 'Not set'} lbs</ThemedText>
        <ThemedText>Bench PR: {quiz.personalRecords?.bench || 'Not set'} lbs</ThemedText>
        <ThemedText>Squat PR: {quiz.personalRecords?.squat || 'Not set'} lbs</ThemedText>
        <ThemedText>Deadlift PR: {quiz.personalRecords?.deadlift || 'Not set'} lbs</ThemedText>
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
