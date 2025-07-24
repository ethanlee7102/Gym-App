import { StyleSheet, Image, Platform, Pressable, TextInput} from 'react-native';
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
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');

    const nextQuiz = () => {
        const numericWeight = parseFloat(weight);
        if (!gender || isNaN(numericWeight)) {
            alert('Please select a gender and enter a valid weight.');
            return;
        }

        setQuiz({ ...quiz, gender: gender as 'Male' | 'Female' | 'Other', weight: numericWeight });
        router.push('/quiz/quiz2'); // go to next screen
    };



    return (
        <NoTabSV>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Step 1: Weight & Gender</ThemedText>
            </ThemedView>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Enter your weight (lbs)"
                    placeholderTextColor="#aaa"
                    value={weight}
                    onChangeText={setWeight}
                />
            

            <ThemedView style={styles.genderContainer}>
          <Pressable
            style={[styles.genderButton, gender === 'Male' && styles.selected]}
            onPress={() => setGender('Male')}
          >
            <ThemedText >Male</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.genderButton, gender === 'Female' && styles.selected]}
            onPress={() => setGender('Female')}
          >
            <ThemedText>Female</ThemedText>
          </Pressable>
        </ThemedView>


             <Pressable style={styles.nextButton} onPress={nextQuiz}>
            <ThemedText >Next</ThemedText>
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/home')}>
                <ThemedText>go to home</ThemedText>
            </Pressable>

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
     genderContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
    },
      genderButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#aaa',
    },
     selected: {
        backgroundColor: '#4aa8ff',
        borderColor: '#4aa8ff',
    },
    nextButton: {
    backgroundColor: '#4aa8ff',
    padding: 14,
    borderRadius: 5,
    alignItems: 'center',
  },
});
