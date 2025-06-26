import { Stack, useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { NavigationContainerRefContext, useNavigationContainerRef } from '@react-navigation/native';


export default function IndexLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="add-post" options={{ animation: 'none' }} />
        </Stack>
        
    );
}