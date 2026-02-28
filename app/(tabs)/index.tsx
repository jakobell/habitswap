import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { buildSwapSuggestions, rankHabits } from '@/lib/habits';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Icon3D } from '@/components/ui/icon-3d';

export default function DashboardScreen() {
  const c = useAppTheme();
  const { badHabits, goodHabits } = useHabitStore();

  const topBad = useMemo(() => rankHabits(badHabits, 'bad')[0], [badHabits]);
  const topGood = useMemo(() => rankHabits(goodHabits, 'good')[0], [goodHabits]);
  const topSwap = useMemo(() => buildSwapSuggestions(badHabits, goodHabits)[0], [badHabits, goodHabits]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}> 
      <View style={styles.container}>
        <Animated.View entering={FadeInUp.delay(100).springify()} style={[styles.hero, { backgroundColor: c.card, borderColor: c.border }]}> 
          <View style={styles.heroTitleRow}>
            <Icon3D name="layers-triple" color="#fff" plate={c.accent} shadow={c.accentSoft} />
            <Text style={[styles.title, { color: c.text }]}>HabitSwap</Text>
          </View>
          <Text style={[styles.subtitle, { color: c.mutedText }]}>Cue → Routine → Reward mit Capability & Opportunity.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(170).springify()} style={[styles.stats, { backgroundColor: c.card, borderColor: c.border }]}>
          <Stat icon="alert" label="Bad Habits" value={String(badHabits.length)} color={c.accent} text={c.text} subtle={c.mutedText} />
          <Stat icon="check-circle" label="Good Habits" value={String(goodHabits.length)} color={c.accent} text={c.text} subtle={c.mutedText} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).springify()} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}> 
          <View style={styles.cardTitleRow}>
            <Icon3D name="swap-horizontal-bold" color="#fff" plate={c.accent} shadow={c.accentSoft} />
            <Text style={[styles.cardTitle, { color: c.text }]}>Top Swap</Text>
          </View>
          <Text style={[styles.body, { color: c.mutedText }]}>❌ {topSwap?.badHabit.name || '—'}</Text>
          <Text style={[styles.body, { color: c.text }]}>✅ {topSwap?.replacement?.name || 'Noch kein Match'}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}> 
          <View style={styles.cardTitleRow}>
            <Icon3D name="target" color="#fff" plate={c.success} shadow="#248f5e" />
            <Text style={[styles.cardTitle, { color: c.text }]}>Aktuell wichtig</Text>
          </View>
          <Text style={[styles.body, { color: c.mutedText }]}>Schlechtes Habit: {topBad?.name || '—'}</Text>
          <Text style={[styles.body, { color: c.mutedText }]}>Bestes Gegen-Habit: {topGood?.name || '—'}</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function Stat({ icon, label, value, color, text, subtle }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; value: string; color: string; text: string; subtle: string }) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text style={[styles.value, { color: text }]}>{value}</Text>
      <Text style={[styles.label, { color: subtle }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, gap: 12, padding: 16 },
  hero: { borderWidth: 1, borderRadius: 24, padding: 18 },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 30, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  stats: { borderWidth: 1, borderRadius: 20, padding: 12, flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  value: { fontSize: 26, fontWeight: '800' },
  label: { fontSize: 12 },
  card: { borderWidth: 1, borderRadius: 20, padding: 14, gap: 6 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  body: { fontSize: 14 },
});
