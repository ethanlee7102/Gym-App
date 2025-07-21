import { Stack, useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { NavigationContainerRefContext, useNavigationContainerRef } from '@react-navigation/native';
import { QuizProvider } from '@/context/quiz-context';


export default function QuizLayout() {
    return (
        <QuizProvider>
            <Stack screenOptions={{ headerShown: false }} >
        
                    <Stack.Screen name="quiz1" options={{ animation: 'none' }} />
                    <Stack.Screen name="quiz2" options={{ animation: 'none' }} />

            </Stack>
        </QuizProvider>
        
    );
}