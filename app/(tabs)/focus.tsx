import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: { bg: '#F5F7FB', card: '#FFFFFF', text: '#111827', subtle: '#637087', border: '#E7EAF2', accent: '#5B5CF0' },
  dark: { bg: '#0F1118', card: '#171A24', text: '#EEF1FA', subtle: '#A2ABBF', border: '#252B3D', accent: '#8C94FF' },
};

export default function FocusScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );
  }, [progress]);

  const pulse = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + progress.value * 0.15 }],
    opacity: 0.5 + progress.value * 0.5,
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(400)} style={[styles.focusCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <Animated.View style={[styles.loader, { borderColor: c.border }, pulse]}>
            <MaterialCommunityIcons name="brain" size={34} color={c.accent} />
          </Animated.View>
          <Text style={[styles.clock, { color: c.text }]}>16:24</Text>
          <Text style={[styles.label, { color: c.subtle }]}>Deep Session läuft</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  focusCard: {
    borderWidth: 1,
    borderRadius: 28,
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  loader: {
    width: 98,
    height: 98,
    borderRadius: 50,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  clock: { fontSize: 40, fontWeight: '800' },
  label: { fontSize: 14, letterSpacing: 0.6 },
});
