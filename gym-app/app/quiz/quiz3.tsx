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
    const [workoutDays, setWorkoutDays] = useState<number[]>([]);

    const nextQuiz = () => {
        if (workoutDays.length === 0) {
            alert('Please select at least one workout day.');
            return;
        }

        setQuiz({ ...quiz, workoutDays });
        router.push('/quiz/quiz_sub'); // go to next screen
    };

    const toggleDay = (day: number) => {
        setWorkoutDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };



    return (
        <NoTabSV>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Step 3: Select your workout days</ThemedText>
            </ThemedView>

            <ThemedView style={styles.daysContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Pressable
                    key={index}
                    style={[
                        styles.dayButton,
                        workoutDays.includes(index) && styles.selected
                    ]}
                    onPress={() => toggleDay(index)}
                    >
                    <ThemedText>{day}</ThemedText>
                    </Pressable>
                ))}
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
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginTop: 10,
    },
    dayButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 5,
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#aaa',
        minWidth: 45,
        alignItems: 'center',
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
