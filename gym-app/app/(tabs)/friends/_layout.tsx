import { Stack, useNavigation, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { NavigationContainerRefContext, useNavigationContainerRef } from '@react-navigation/native';


export default function FriendsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} >
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="add-friend" options={{ animation: 'none' }} />
            <Stack.Screen name="friend-request" options={{ animation: 'none' }} />
        </Stack>
        
    );
}