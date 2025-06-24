import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

type Props = PropsWithChildren<{}>;

export default function NoTabSV({ children }: Props) {

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
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
    paddingBottom: 40,
    padding: 32,
    gap: 16,
  },
});