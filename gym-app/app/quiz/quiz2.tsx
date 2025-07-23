import { StyleSheet, Image, Platform, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import NoTabSV from '@/components/NoTabSV';
import { useQuiz } from '@/context/quiz-context';

export default function TabTwoScreen() {
  const { quiz, setQuiz } = useQuiz();
  const [bench, setBench] = useState('');
  const [squat, setSquat] = useState('');
  const [deadlift, setDeadlift] = useState('');

   const nextQuiz = () => {
    const parsedBench = parseFloat(bench);
    const parsedSquat = parseFloat(squat);
    const parsedDeadlift = parseFloat(deadlift);

    if (isNaN(parsedBench) || isNaN(parsedSquat) || isNaN(parsedDeadlift)) {
      alert('Please enter valid numbers for all PRs.');
      return;
    }

    setQuiz({...quiz, personalRecords: {
        squat: parsedSquat,
        bench: parsedBench,
        deadlift: parsedDeadlift,
      },
    });

    
    router.push('/quiz/quiz_sub'); 
  };

  return (
    <NoTabSV>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Step 2: Personal Records</ThemedText>
      </ThemedView>

      <ThemedView>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Bench Press (lbs)"
          placeholderTextColor="#aaa"
          value={bench}
          onChangeText={setBench}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Squat (lbs)"
          placeholderTextColor="#aaa"
          value={squat}
          onChangeText={setSquat}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Deadlift (lbs)"
          placeholderTextColor="#aaa"
          value={deadlift}
          onChangeText={setDeadlift}
        />
      </ThemedView>

      <Pressable style={styles.nextButton} onPress={nextQuiz}>
        <ThemedText type="defaultSemiBold">Next</ThemedText>
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
   input: {
    backgroundColor: '#1C1C1C',
    color: 'white',
    borderColor: '#AFAFAF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
   nextButton: {
    backgroundColor: '#4aa8ff',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
