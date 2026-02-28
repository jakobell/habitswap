import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const swaps = [
  { from: 'doom-scroll', to: 'walk', impact: '+38', icon: 'swap-horizontal-circle' },
  { from: 'late-snack', to: 'tea', impact: '+26', icon: 'food-apple' },
  { from: 'skip-break', to: 'breath', impact: '+19', icon: 'meditation' },
];

const palette = {
  light: { bg: '#F5F7FB', card: '#FFFFFF', text: '#111827', subtle: '#637087', border: '#E7EAF2', accent: '#5B5CF0' },
  dark: { bg: '#0F1118', card: '#171A24', text: '#EEF1FA', subtle: '#A2ABBF', border: '#252B3D', accent: '#8C94FF' },
};

export default function SwapsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <View style={styles.container}>
        {swaps.map((swap, idx) => (
          <Animated.View
            entering={(idx % 2 ? FadeInRight : FadeInLeft).delay(80 * idx + 100).springify()}
            key={swap.from}
            style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
            <MaterialCommunityIcons name={swap.icon as MaterialIconName} size={26} color={c.accent} />
            <View style={styles.center}>
              <Text style={[styles.from, { color: c.subtle }]}>{swap.from}</Text>
              <Text style={[styles.to, { color: c.text }]}>{swap.to}</Text>
            </View>
            <Text style={[styles.impact, { color: c.accent }]}>{swap.impact}</Text>
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  center: { flex: 1, gap: 2 },
  from: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  to: { fontSize: 24, fontWeight: '800' },
  impact: { fontSize: 24, fontWeight: '800' },
});
