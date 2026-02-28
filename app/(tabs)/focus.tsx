import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { buildSwapSuggestions } from '@/lib/habits';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Icon3D } from '@/components/ui/icon-3d';

export default function FocusScreen() {
  const c = useAppTheme();
  const { badHabits, goodHabits } = useHabitStore();

  const swap = useMemo(() => buildSwapSuggestions(badHabits, goodHabits)[0], [badHabits, goodHabits]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}> 
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}> 
        <View style={styles.titleRow}>
          <Icon3D name="bullseye-arrow" color="#fff" plate={c.accent} shadow={c.accentSoft} />
          <Text style={[styles.title, { color: c.text }]}>Nächster Prompt</Text>
        </View>
        <Text style={[styles.text, { color: c.mutedText }]}>Trigger erkannt: {swap?.badHabit.cue || '—'}</Text>
        <Text style={[styles.text, { color: c.text }]}>Alternative Routine: {swap?.replacement?.name || 'Noch kein Match'}</Text>
        <Text style={[styles.text, { color: c.mutedText }]}>Prompt: {swap?.replacement?.prompt || 'Prompt im Swap-Tab definieren'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 20, padding: 14, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 22, fontWeight: '800' },
  text: { fontSize: 14 },
});
