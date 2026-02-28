import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

const visuals = [
  'https://img.icons8.com/3d-fluency/188/bicycle.png',
  'https://img.icons8.com/3d-fluency/188/meditation-guru.png',
  'https://img.icons8.com/3d-fluency/188/clock.png',
];

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const cards = [
  { icon: 'run-fast', value: '07', label: 'Streak' },
  { icon: 'target-account', value: '84%', label: 'Match' },
  { icon: 'calendar-check', value: '5', label: 'Heute' },
];

const palette = {
  light: {
    bg: '#F5F7FB',
    card: '#FFFFFF',
    text: '#111827',
    subtle: '#637087',
    accent: '#5B5CF0',
    border: '#E7EAF2',
  },
  dark: {
    bg: '#0F1118',
    card: '#171A24',
    text: '#EEF1FA',
    subtle: '#A2ABBF',
    accent: '#8C94FF',
    border: '#252B3D',
  },
};

export default function DashboardScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.delay(100).springify()} style={[styles.hero, { backgroundColor: c.card, borderColor: c.border }]}>
          <View>
            <Text style={[styles.title, { color: c.text }]}>HabitSwap</Text>
            <Text style={[styles.subtitle, { color: c.subtle }]}>Schneller wechseln. Weniger scrollen.</Text>
          </View>
          <MaterialCommunityIcons name="orbit" size={34} color={c.accent} />
        </Animated.View>

        <Animated.View layout={LinearTransition.springify()} style={styles.statGrid}>
          {cards.map((card, index) => (
            <Animated.View
              entering={FadeInDown.delay(120 + index * 80).springify()}
              key={card.label}
              style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}>
              <MaterialCommunityIcons name={card.icon as MaterialIconName} size={22} color={c.accent} />
              <Text style={[styles.statValue, { color: c.text }]}>{card.value}</Text>
              <Text style={[styles.statLabel, { color: c.subtle }]}>{card.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).springify()} style={[styles.visualRail, { backgroundColor: c.card, borderColor: c.border }]}>
          {visuals.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.visualImage} contentFit="contain" transition={300} />
          ))}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, gap: 14, padding: 16 },
  hero: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 30, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  statGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 26, fontWeight: '800' },
  statLabel: { fontSize: 12 },
  visualRail: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visualImage: {
    width: 92,
    height: 92,
  },
});
