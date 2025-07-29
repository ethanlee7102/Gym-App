import { StyleSheet, Image, Platform, View, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getEloLeaderboard } from '@/app/api/api';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView header = {
      <View style={styles.titleContainer}>
        <ThemedText type="title">Leaderboard3</ThemedText>
      </View>
    }>
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-1')}>
                        <ThemedText type='smallSemiBold'>Streaks</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-2')}>
                        <ThemedText type='smallSemiBold'>Level</ThemedText>
            </Pressable>
            <Pressable style={styles.buttonSelected} onPress={() => router.push('/leaderboard/leaderboard-3')}>
                        <ThemedText type='smallSemiBold'>ELO?</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push('/leaderboard/leaderboard-4')}>
                        <ThemedText type='smallSemiBold'>DOTS</ThemedText>
            </Pressable>
        </View>
      
    </ParallaxScrollView>
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
    buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 0,
    
        backgroundColor: '#373737',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,
        
        width: 80,
        height: 30
    },
    buttonSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 0,
    
        backgroundColor: '#919191ff',
        borderColor: '#AFAFAF',
        borderWidth: 1,
        margin: 5,
        
        width: 80,
        height: 30
    },
});
