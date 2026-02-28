import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/context/habit-context';
import { buildSwapSuggestions, emptyForm, HabitForm, motivationTypeLabel, parseHabit } from '@/lib/habits';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Icon3D } from '@/components/ui/icon-3d';

export default function SwapsScreen() {
  const c = useAppTheme();
  const { badHabits, goodHabits, addHabit, deleteHabit } = useHabitStore();
  const [badForm, setBadForm] = useState<HabitForm>(emptyForm);
  const [goodForm, setGoodForm] = useState<HabitForm>(emptyForm);

  const suggestions = useMemo(() => buildSwapSuggestions(badHabits, goodHabits).slice(0, 4), [badHabits, goodHabits]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Panel title="Top Habit-Swaps" icon="head-sync" iconColor="#fff" iconPlate={c.accent} iconShadow={c.accentSoft} c={c}>
          {suggestions.map(({ badHabit, replacement }) => (
            <View key={badHabit.id} style={[styles.swapCard, { borderColor: c.border, backgroundColor: c.cardSoft }]}> 
              <Text style={[styles.badText, { color: c.danger }]}>Alt: {badHabit.name}</Text>
              <Text style={[styles.goodText, { color: c.success }]}>Neu: {replacement?.name || 'Noch kein Match'}</Text>
              <Text style={[styles.meta, { color: c.mutedText }]}>Cue: {badHabit.cue || '—'}</Text>
              <Text style={[styles.meta, { color: c.mutedText }]}>Reward: {badHabit.reward || '—'}</Text>
            </View>
          ))}
        </Panel>

        <Panel title="Schlechte Habit hinzufügen" icon="emoticon-sad-outline" iconColor="#fff" iconPlate={c.danger} iconShadow="#9f3347" c={c}>
          <HabitFormFields form={badForm} setForm={setBadForm} c={c} />
          <Action label="Schlechte Habit speichern" color={c.danger} onPress={() => {
            const parsed = parseHabit(badForm);
            if (!parsed) return;
            addHabit('bad', parsed);
            setBadForm(emptyForm);
          }} />
        </Panel>

        <Panel title="Gute Habit hinzufügen" icon="sprout" iconColor="#fff" iconPlate={c.success} iconShadow="#248f5e" c={c}>
          <HabitFormFields form={goodForm} setForm={setGoodForm} c={c} />
          <Action label="Gute Habit speichern" color={c.success} onPress={() => {
            const parsed = parseHabit(goodForm);
            if (!parsed) return;
            addHabit('good', parsed);
            setGoodForm(emptyForm);
          }} />
        </Panel>

        <Panel title="Habits verwalten" icon="puzzle" iconColor="#fff" iconPlate={c.accent} iconShadow={c.accentSoft} c={c}>
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

function Panel({ title, c, children, icon, iconColor, iconPlate, iconShadow }: { title: string; c: any; children: React.ReactNode; icon: React.ComponentProps<typeof Icon3D>['name']; iconColor: string; iconPlate: string; iconShadow: string }) {
  return (
    <View style={[styles.panel, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={styles.panelTitleRow}>
        <Icon3D name={icon} color={iconColor} plate={iconPlate} shadow={iconShadow} />
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
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
          <Pressable key={type} style={[styles.typePill, { borderColor: c.border, backgroundColor: form.motivationType === type ? c.accent : c.cardSoft }]} onPress={() => setForm((o) => ({ ...o, motivationType: type }))}>
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
      <Text style={[styles.meta, { color: c.mutedText }]}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} keyboardType={numeric ? 'numeric' : 'default'} style={[styles.input, { borderColor: c.inputBorder, color: c.text, backgroundColor: c.inputBackground }]} placeholder={label} placeholderTextColor={c.mutedText} />
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
        <Text style={{ color: c.mutedText, fontSize: 12 }}>{detail}</Text>
      </View>
      <Pressable onPress={onDelete}><Text style={{ color: c.danger }}>Löschen</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, gap: 12, paddingBottom: 120 },
  panel: { borderWidth: 1, borderRadius: 20, padding: 14, gap: 10 },
  panelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '800' },
  swapCard: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 8 },
  badText: { fontWeight: '700' },
  goodText: { fontWeight: '700', marginTop: 4 },
  meta: { fontSize: 12 },
  field: { gap: 5 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  button: { marginTop: 6, borderRadius: 12, paddingVertical: 11, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  typePill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  row: { borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
});
