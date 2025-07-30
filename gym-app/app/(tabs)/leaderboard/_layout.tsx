import { Stack, useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { NavigationContainerRefContext, useNavigationContainerRef } from '@react-navigation/native';


export default function IndexLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="leaderboard-streak" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-level" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-3" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-dots" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-bench" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-squat" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-deadlift" options={{ animation: 'none' }} />
        </Stack>
        
    );
}