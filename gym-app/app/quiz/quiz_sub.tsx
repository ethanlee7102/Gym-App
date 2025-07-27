import { StyleSheet, Image, Platform, Pressable, Alert } from 'react-native';

import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import NoTabSV from '@/components/NoTabSV';
import { useQuiz } from '@/context/quiz-context';
import { submitQuiz } from '../api/api';
import{ useUser } from '@/context/user-context'

export default function TabTwoScreen() {
  const { quiz } = useQuiz();
  const { refetchUser } = useUser();

   const subQuiz = async () => {
    try {
        await submitQuiz(quiz);
        refetchUser();
        router.replace('/(tabs)/home');
    }
    catch(e){
        Alert.alert('Error', 'Submission failed.');
        console.error('Submission error:', e);
    }
   }

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

      <Pressable style={styles.button} onPress={subQuiz}>
        <ThemedText type="defaultSemiBold">Submit Quiz</ThemedText>
      </Pressable>

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
  button: {
    backgroundColor: '#4aa8ff',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
});
