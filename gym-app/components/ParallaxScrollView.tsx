import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, ScrollViewProps, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

type Props = PropsWithChildren<ScrollViewProps> & {
  header?: ReactNode;
};;

export default function ParallaxScrollView({ children, header, ...scrollProps }: Props) {
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <BlurView intensity={3} tint="dark" style={styles.topBlur} />
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)','rgba(0,0,0,0)']}
        style={styles.topGradient}
      />

      <View style={styles.headerContainer}>
        {header}
      </View>
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ top: 60, bottom }}
        contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
        {...scrollProps}
      >
        {children}
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 127,
    padding: 27,
    gap: 16,
  },
  topBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 127,
    zIndex: 1,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 117,
    zIndex: 2, // higher than blur, lower than header
  },
  headerContainer: {
    position: 'absolute',
    top: 47,
    left: 27,
    right: 27,
    height: 60,
    justifyContent: 'center',
    zIndex: 3,
  },
});