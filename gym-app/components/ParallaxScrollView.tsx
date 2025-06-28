import type { PropsWithChildren } from 'react';
import { StyleSheet, ScrollViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

type Props = PropsWithChildren<ScrollViewProps>;

export default function ParallaxScrollView({ children, ...scrollProps }: Props) {
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
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
    paddingTop: 60,
    padding: 27,
    gap: 16,
  },
});