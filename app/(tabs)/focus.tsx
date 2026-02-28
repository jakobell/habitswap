import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { buildSwapSuggestions } from '@/lib/habits';
import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: { bg: '#F5F7FB', card: '#FFFFFF', text: '#111827', subtle: '#637087', border: '#E7EAF2', accent: '#5B5CF0' },
  dark: { bg: '#0F1118', card: '#171A24', text: '#EEF1FA', subtle: '#A2ABBF', border: '#252B3D', accent: '#8C94FF' },
};

export default function FocusScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];
  const { badHabits, goodHabits } = useHabitStore();

  const swap = useMemo(() => buildSwapSuggestions(badHabits, goodHabits)[0], [badHabits, goodHabits]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.title, { color: c.text }]}>Nächster Prompt</Text>
        <Text style={[styles.text, { color: c.subtle }]}>Trigger erkannt: {swap?.badHabit.cue || '—'}</Text>
        <Text style={[styles.text, { color: c.text }]}>Alternative Routine: {swap?.replacement?.name || 'Noch kein Match'}</Text>
        <Text style={[styles.text, { color: c.subtle }]}>Prompt: {swap?.replacement?.prompt || 'Prompt im Swap-Tab definieren'}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderRadius: 20, padding: 14, gap: 8 },
  title: { fontSize: 22, fontWeight: '800' },
  text: { fontSize: 14 },
});
