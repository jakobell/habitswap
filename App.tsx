import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type HabitKind = 'bad' | 'good';

type Habit = {
  id: string;
  name: string;
  cue: string;
  reward: string;
  impact: number;
  timeMinutes: number;
  difficulty: number;
  motivation: number;
  opportunity: number;
};

type HabitForm = {
  name: string;
  cue: string;
  reward: string;
  impact: string;
  timeMinutes: string;
  difficulty: string;
  motivation: string;
  opportunity: string;
};

const emptyForm: HabitForm = {
  name: '',
  cue: '',
  reward: '',
  impact: '5',
  timeMinutes: '15',
  difficulty: '5',
  motivation: '5',
  opportunity: '5',
};

const initialBad: Habit[] = [
  {
    id: 'bad-1',
    name: 'Endloses Social Media Scrollen',
    cue: 'Abend auf dem Sofa / Müdigkeit',
    reward: 'Schneller Dopamin-Kick, Ablenkung',
    impact: 7,
    timeMinutes: 90,
    difficulty: 8,
    motivation: 7,
    opportunity: 9,
  },
  {
    id: 'bad-2',
    name: 'Stress-Snacking',
    cue: 'Arbeitsstress am Nachmittag',
    reward: 'Sofortige Entspannung',
    impact: 6,
    timeMinutes: 25,
    difficulty: 7,
    motivation: 6,
    opportunity: 8,
  },
];

const initialGood: Habit[] = [
  {
    id: 'good-1',
    name: '10 Minuten Spaziergang',
    cue: 'Nachmittags-Pause im Kalender',
    reward: 'Stressabbau und Klarheit',
    impact: 8,
    timeMinutes: 10,
    difficulty: 3,
    motivation: 6,
    opportunity: 7,
  },
  {
    id: 'good-2',
    name: '5 Minuten Atemübung',
    cue: 'Direkt vor Snack-Impuls',
    reward: 'Beruhigung',
    impact: 7,
    timeMinutes: 5,
    difficulty: 2,
    motivation: 7,
    opportunity: 9,
  },
];

const toScore = (habit: Habit, kind: HabitKind) => {
  const impactWeight = 3;
  const timeWeight = 2;
  const difficultyWeight = 2;
  const motivationWeight = 1.5;
  const opportunityWeight = 1.5;

  if (kind === 'bad') {
    return (
      habit.impact * impactWeight +
      (habit.timeMinutes / 10) * timeWeight +
      habit.difficulty * difficultyWeight +
      habit.motivation * motivationWeight +
      habit.opportunity * opportunityWeight
    );
  }

  return (
    habit.impact * impactWeight +
    ((60 - habit.timeMinutes) / 10) * timeWeight +
    (10 - habit.difficulty) * difficultyWeight +
    habit.motivation * motivationWeight +
    habit.opportunity * opportunityWeight
  );
};

const parseHabit = (form: HabitForm): Habit | null => {
  if (!form.name.trim()) {
    return null;
  }

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: form.name.trim(),
    cue: form.cue.trim(),
    reward: form.reward.trim(),
    impact: clampNumber(form.impact),
    timeMinutes: clampNumber(form.timeMinutes, 1, 240),
    difficulty: clampNumber(form.difficulty),
    motivation: clampNumber(form.motivation),
    opportunity: clampNumber(form.opportunity),
  };
};

const clampNumber = (value: string, min = 0, max = 10) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.round(parsed)));
};

const HabitCard = ({
  habit,
  kind,
  onDelete,
}: {
  habit: Habit;
  kind: HabitKind;
  onDelete: (id: string) => void;
}) => {
  const score = toScore(habit, kind);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{habit.name}</Text>
        <TouchableOpacity onPress={() => onDelete(habit.id)}>
          <Text style={styles.delete}>Löschen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.metric}>Cue: {habit.cue || '—'}</Text>
      <Text style={styles.metric}>Reward: {habit.reward || '—'}</Text>
      <Text style={styles.metric}>Impact/Nutzen: {habit.impact}/10</Text>
      <Text style={styles.metric}>Zeit: {habit.timeMinutes} Min/Tag</Text>
      <Text style={styles.metric}>Schwierigkeit: {habit.difficulty}/10</Text>
      <Text style={styles.metric}>Motivation: {habit.motivation}/10</Text>
      <Text style={styles.metric}>Opportunity: {habit.opportunity}/10</Text>
      <Text style={styles.score}>Prioritäts-Score: {score.toFixed(1)}</Text>
    </View>
  );
};

const FormField = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
}) => (
  <View style={styles.formField}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      keyboardType={keyboardType}
      placeholder={label}
      placeholderTextColor="#64748b"
    />
  </View>
);

export default function App() {
  const [badHabits, setBadHabits] = useState<Habit[]>(initialBad);
  const [goodHabits, setGoodHabits] = useState<Habit[]>(initialGood);
  const [badForm, setBadForm] = useState<HabitForm>(emptyForm);
  const [goodForm, setGoodForm] = useState<HabitForm>(emptyForm);

  const rankedBad = useMemo(
    () => [...badHabits].sort((a, b) => toScore(b, 'bad') - toScore(a, 'bad')),
    [badHabits],
  );

  const rankedGood = useMemo(
    () => [...goodHabits].sort((a, b) => toScore(b, 'good') - toScore(a, 'good')),
    [goodHabits],
  );

  const swapSuggestions = useMemo(() => {
    return rankedBad.slice(0, 3).map((badHabit) => {
      const match = rankedGood
        .map((goodHabit) => {
          const rewardMatch = includesWord(goodHabit.reward, badHabit.reward) ? 2 : 0;
          const cueMatch = includesWord(goodHabit.cue, badHabit.cue) ? 1 : 0;
          const timePenalty = Math.abs(goodHabit.timeMinutes - badHabit.timeMinutes) / 20;
          const compatibility = toScore(goodHabit, 'good') + rewardMatch + cueMatch - timePenalty;
          return { goodHabit, compatibility };
        })
        .sort((a, b) => b.compatibility - a.compatibility)[0];

      return { badHabit, replacement: match?.goodHabit };
    });
  }, [rankedBad, rankedGood]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>HabitSwap</Text>
        <Text style={styles.subtitle}>
          Ersetze schlechte Gewohnheiten systematisch über Cue, Reward, Impact, Zeit,
          Motivation, Fähigkeit und Opportunity.
        </Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Top Habit-Swaps</Text>
          {swapSuggestions.map(({ badHabit, replacement }) => (
            <View key={badHabit.id} style={styles.swapItem}>
              <Text style={styles.swapHeadline}>❌ {badHabit.name}</Text>
              <Text style={styles.swapArrow}>↳ ✅ {replacement?.name || 'Noch kein Match vorhanden'}</Text>
              <Text style={styles.swapMeta}>Cue: {badHabit.cue || '—'}</Text>
              <Text style={styles.swapMeta}>Reward: {badHabit.reward || '—'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Schlechte Habit hinzufügen</Text>
          <FormField
            label="Name"
            value={badForm.name}
            onChangeText={(value) => setBadForm((old) => ({ ...old, name: value }))}
          />
          <FormField
            label="Cue / Trigger"
            value={badForm.cue}
            onChangeText={(value) => setBadForm((old) => ({ ...old, cue: value }))}
          />
          <FormField
            label="Reward"
            value={badForm.reward}
            onChangeText={(value) => setBadForm((old) => ({ ...old, reward: value }))}
          />
          <NumberFields form={badForm} setForm={setBadForm} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const parsed = parseHabit(badForm);
              if (!parsed) return;
              setBadHabits((old) => [parsed, ...old]);
              setBadForm(emptyForm);
            }}
          >
            <Text style={styles.buttonText}>Schlechte Habit speichern</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Gute Habit hinzufügen</Text>
          <FormField
            label="Name"
            value={goodForm.name}
            onChangeText={(value) => setGoodForm((old) => ({ ...old, name: value }))}
          />
          <FormField
            label="Cue / Trigger"
            value={goodForm.cue}
            onChangeText={(value) => setGoodForm((old) => ({ ...old, cue: value }))}
          />
          <FormField
            label="Reward"
            value={goodForm.reward}
            onChangeText={(value) => setGoodForm((old) => ({ ...old, reward: value }))}
          />
          <NumberFields form={goodForm} setForm={setGoodForm} />
          <TouchableOpacity
            style={[styles.button, styles.goodButton]}
            onPress={() => {
              const parsed = parseHabit(goodForm);
              if (!parsed) return;
              setGoodHabits((old) => [parsed, ...old]);
              setGoodForm(emptyForm);
            }}
          >
            <Text style={styles.buttonText}>Gute Habit speichern</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Schlechte Habits (priorisiert)</Text>
        {rankedBad.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            kind="bad"
            onDelete={(id) => setBadHabits((old) => old.filter((item) => item.id !== id))}
          />
        ))}

        <Text style={styles.sectionTitle}>Gute Habits (priorisiert)</Text>
        {rankedGood.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            kind="good"
            onDelete={(id) => setGoodHabits((old) => old.filter((item) => item.id !== id))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const NumberFields = ({
  form,
  setForm,
}: {
  form: HabitForm;
  setForm: React.Dispatch<React.SetStateAction<HabitForm>>;
}) => (
  <>
    <FormField
      label="Impact/Nutzen (0-10)"
      value={form.impact}
      keyboardType="numeric"
      onChangeText={(value) => setForm((old) => ({ ...old, impact: value }))}
    />
    <FormField
      label="Zeit (Min/Tag)"
      value={form.timeMinutes}
      keyboardType="numeric"
      onChangeText={(value) => setForm((old) => ({ ...old, timeMinutes: value }))}
    />
    <FormField
      label="Schwierigkeit (0-10)"
      value={form.difficulty}
      keyboardType="numeric"
      onChangeText={(value) => setForm((old) => ({ ...old, difficulty: value }))}
    />
    <FormField
      label="Motivation (0-10)"
      value={form.motivation}
      keyboardType="numeric"
      onChangeText={(value) => setForm((old) => ({ ...old, motivation: value }))}
    />
    <FormField
      label="Opportunity (0-10)"
      value={form.opportunity}
      keyboardType="numeric"
      onChangeText={(value) => setForm((old) => ({ ...old, opportunity: value }))}
    />
  </>
);

const includesWord = (left: string, right: string) => {
  const l = left.toLowerCase();
  return right
    .toLowerCase()
    .split(/\s+/)
    .some((part) => part.length > 3 && l.includes(part));
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#020617',
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  panel: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  panelTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontWeight: '700',
    flex: 1,
  },
  delete: {
    color: '#f87171',
    fontWeight: '600',
  },
  metric: {
    color: '#cbd5e1',
    marginBottom: 2,
  },
  score: {
    color: '#22d3ee',
    marginTop: 6,
    fontWeight: '700',
  },
  formField: {
    marginBottom: 8,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 4,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    color: '#f8fafc',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
    alignItems: 'center',
  },
  goodButton: {
    backgroundColor: '#16a34a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  swapItem: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  swapHeadline: {
    color: '#fda4af',
    fontWeight: '700',
  },
  swapArrow: {
    color: '#86efac',
    fontWeight: '700',
    marginTop: 2,
  },
  swapMeta: {
    color: '#cbd5e1',
    marginTop: 2,
    fontSize: 12,
  },
});
