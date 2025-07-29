import { Stack, useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { NavigationContainerRefContext, useNavigationContainerRef } from '@react-navigation/native';


export default function IndexLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="leaderboard-1" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-2" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-3" options={{ animation: 'none' }} />
            <Stack.Screen name="leaderboard-4" options={{ animation: 'none' }} />
        </Stack>
        
    );
}