import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { Habit, HabitKind, motivationTypeLabel, toScore } from '@/lib/habits';
import { useAppTheme } from '@/hooks/use-app-theme';

type Section = { title: string; habits: Habit[]; kind: HabitKind };

export default function ExploreScreen() {
  const c = useAppTheme();
  const { badHabits, goodHabits } = useHabitStore();

  const sections: Section[] = [
    { title: 'Schlechte Habits', habits: badHabits, kind: 'bad' },
    { title: 'Gute Habits', habits: goodHabits, kind: 'good' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {sections.map((section) => (
          <View key={section.title} style={[styles.panel, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.title, { color: c.text }]}>🗂️ {section.title}</Text>
            {section.habits.map((habit) => (
              <View key={habit.id} style={[styles.row, { borderColor: c.border }]}>
                <Text style={[styles.name, { color: c.text }]}>{habit.name}</Text>
                <Text style={[styles.meta, { color: c.mutedText }]}>Cue: {habit.cue || '—'} • Reward: {habit.reward || '—'}</Text>
                <Text style={[styles.meta, { color: c.mutedText }]}>Motivation: {motivationTypeLabel[habit.motivationType]} • Score {toScore(habit, section.kind).toFixed(1)}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 120 },
  panel: { borderWidth: 1, borderRadius: 20, padding: 12, gap: 8 },
  title: { fontSize: 18, fontWeight: '800' },
  row: { borderWidth: 1, borderRadius: 12, padding: 10, gap: 3 },
  name: { fontWeight: '700' },
  meta: { fontSize: 12 },
});
