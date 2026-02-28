import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { buildSwapSuggestions, emptyForm, HabitForm, motivationTypeLabel, parseHabit } from '@/lib/habits';
import { useColorScheme } from '@/hooks/use-color-scheme';

const palette = {
  light: { bg: '#F5F7FB', card: '#FFFFFF', text: '#111827', subtle: '#637087', accent: '#5B5CF0', border: '#E7EAF2', bad: '#dc2626', good: '#16a34a' },
  dark: { bg: '#0F1118', card: '#171A24', text: '#EEF1FA', subtle: '#A2ABBF', accent: '#8C94FF', border: '#252B3D', bad: '#fb7185', good: '#4ade80' },
};

export default function SwapsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];
  const { badHabits, goodHabits, addHabit, deleteHabit } = useHabitStore();
  const [badForm, setBadForm] = useState<HabitForm>(emptyForm);
  const [goodForm, setGoodForm] = useState<HabitForm>(emptyForm);

  const suggestions = useMemo(() => buildSwapSuggestions(badHabits, goodHabits).slice(0, 4), [badHabits, goodHabits]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Panel title="Top Habit-Swaps" c={c}>
          {suggestions.map(({ badHabit, replacement }) => (
            <View key={badHabit.id} style={[styles.swapCard, { borderColor: c.border }]}> 
              <Text style={[styles.badText, { color: c.bad }]}>❌ {badHabit.name}</Text>
              <Text style={[styles.goodText, { color: c.good }]}>✅ {replacement?.name || 'Noch kein Match'}</Text>
              <Text style={[styles.meta, { color: c.subtle }]}>Cue: {badHabit.cue || '—'}</Text>
              <Text style={[styles.meta, { color: c.subtle }]}>Reward: {badHabit.reward || '—'}</Text>
            </View>
          ))}
        </Panel>

        <Panel title="Schlechte Habit hinzufügen" c={c}>
          <HabitFormFields form={badForm} setForm={setBadForm} c={c} />
          <Action label="Schlechte Habit speichern" color={c.bad} onPress={() => {
            const parsed = parseHabit(badForm);
            if (!parsed) return;
            addHabit('bad', parsed);
            setBadForm(emptyForm);
          }} />
        </Panel>

        <Panel title="Gute Habit hinzufügen" c={c}>
          <HabitFormFields form={goodForm} setForm={setGoodForm} c={c} />
          <Action label="Gute Habit speichern" color={c.good} onPress={() => {
            const parsed = parseHabit(goodForm);
            if (!parsed) return;
            addHabit('good', parsed);
            setGoodForm(emptyForm);
          }} />
        </Panel>

        <Panel title="Habits verwalten" c={c}>
          {badHabits.map((habit) => (
            <HabitRow key={habit.id} name={habit.name} detail={`bad • ${motivationTypeLabel[habit.motivationType]}`} onDelete={() => deleteHabit('bad', habit.id)} c={c} />
          ))}
          {goodHabits.map((habit) => (
            <HabitRow key={habit.id} name={habit.name} detail={`good • ${motivationTypeLabel[habit.motivationType]}`} onDelete={() => deleteHabit('good', habit.id)} c={c} />
          ))}
        </Panel>
      </ScrollView>
    </SafeAreaView>
  );
}

function Panel({ title, c, children }: { title: string; c: any; children: React.ReactNode }) {
  return <View style={[styles.panel, { backgroundColor: c.card, borderColor: c.border }]}><Text style={[styles.title, { color: c.text }]}>{title}</Text>{children}</View>;
}

function HabitFormFields({ form, setForm, c }: { form: HabitForm; setForm: React.Dispatch<React.SetStateAction<HabitForm>>; c: any }) {
  return (
    <>
      <Field label="Name" value={form.name} onChangeText={(v) => setForm((o) => ({ ...o, name: v }))} c={c} />
      <Field label="Cue/Trigger" value={form.cue} onChangeText={(v) => setForm((o) => ({ ...o, cue: v }))} c={c} />
      <Field label="Reward" value={form.reward} onChangeText={(v) => setForm((o) => ({ ...o, reward: v }))} c={c} />
      <Field label="Prompt" value={form.prompt} onChangeText={(v) => setForm((o) => ({ ...o, prompt: v }))} c={c} />
      <Field label="Impact (0-10)" value={form.impact} onChangeText={(v) => setForm((o) => ({ ...o, impact: v }))} numeric c={c} />
      <Field label="Zeit Min/Tag" value={form.timeMinutes} onChangeText={(v) => setForm((o) => ({ ...o, timeMinutes: v }))} numeric c={c} />
      <Field label="Difficulty (0-10)" value={form.difficulty} onChangeText={(v) => setForm((o) => ({ ...o, difficulty: v }))} numeric c={c} />
      <Field label="Motivation (0-10)" value={form.motivation} onChangeText={(v) => setForm((o) => ({ ...o, motivation: v }))} numeric c={c} />
      <Field label="Capability (0-10)" value={form.capability} onChangeText={(v) => setForm((o) => ({ ...o, capability: v }))} numeric c={c} />
      <Field label="Opportunity (0-10)" value={form.opportunity} onChangeText={(v) => setForm((o) => ({ ...o, opportunity: v }))} numeric c={c} />
      <View style={styles.typeRow}>
        {(['intrinsic', 'extrinsic', 'mixed'] as const).map((type) => (
          <Pressable key={type} style={[styles.typePill, { borderColor: c.border, backgroundColor: form.motivationType === type ? c.accent : c.card }]} onPress={() => setForm((o) => ({ ...o, motivationType: type }))}>
            <Text style={{ color: form.motivationType === type ? '#fff' : c.text, fontSize: 12 }}>{motivationTypeLabel[type]}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function Field({ label, value, onChangeText, c, numeric = false }: { label: string; value: string; onChangeText: (v: string) => void; c: any; numeric?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.meta, { color: c.subtle }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} keyboardType={numeric ? 'numeric' : 'default'} style={[styles.input, { borderColor: c.border, color: c.text }]} placeholder={label} placeholderTextColor={c.subtle} />
    </View>
  );
}

function Action({ label, onPress, color }: { label: string; onPress: () => void; color: string }) {
  return <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}><Text style={styles.buttonText}>{label}</Text></Pressable>;
}

function HabitRow({ name, detail, onDelete, c }: { name: string; detail: string; onDelete: () => void; c: any }) {
  return (
    <View style={[styles.row, { borderColor: c.border }]}> 
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontWeight: '700' }}>{name}</Text>
        <Text style={{ color: c.subtle, fontSize: 12 }}>{detail}</Text>
      </View>
      <Pressable onPress={onDelete}><Text style={{ color: c.bad }}>Löschen</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 120 },
  panel: { borderWidth: 1, borderRadius: 20, padding: 12, gap: 8 },
  title: { fontSize: 16, fontWeight: '800' },
  swapCard: { borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 8 },
  badText: { fontWeight: '700' },
  goodText: { fontWeight: '700', marginTop: 4 },
  meta: { fontSize: 12 },
  field: { gap: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  button: { marginTop: 6, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  typePill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  row: { borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
});
