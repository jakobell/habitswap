import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

type HabitKind = "bad" | "good";

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

type TutorialStep = {
  title: string;
  text: string;
};

const STORAGE_KEY = "habitswap:data:v1";
const ONBOARDING_KEY = "habitswap:onboarding:v1";

const tutorial: TutorialStep[] = [
  {
    title: "Willkommen bei HabitSwap",
    text: "Du ersetzt ein störendes Habit durch eine bessere Alternative mit ähnlichem Trigger und Reward.",
  },
  {
    title: "Wie das Scoring funktioniert",
    text: "Impact, Zeit, Schwierigkeit, Motivation und Opportunity werden gewichtet. Dadurch siehst du schnell, welche Änderung den größten Hebel hat.",
  },
  {
    title: "Von Liste zu visuellem Grid",
    text: "Die wichtigsten Swaps und Habits siehst du als Karten-Grid. So erkennst du Muster schneller als in einer langen Liste.",
  },
];

const emptyForm: HabitForm = {
  name: "",
  cue: "",
  reward: "",
  impact: "5",
  timeMinutes: "15",
  difficulty: "5",
  motivation: "5",
  opportunity: "5",
};

const initialBad: Habit[] = [
  {
    id: "bad-1",
    name: "Endloses Social Media Scrollen",
    cue: "Abend auf dem Sofa / Müdigkeit",
    reward: "Schneller Dopamin-Kick, Ablenkung",
    impact: 7,
    timeMinutes: 90,
    difficulty: 8,
    motivation: 7,
    opportunity: 9,
  },
];

const initialGood: Habit[] = [
  {
    id: "good-1",
    name: "10 Minuten Spaziergang",
    cue: "Nachmittags-Pause im Kalender",
    reward: "Stressabbau und Klarheit",
    impact: 8,
    timeMinutes: 10,
    difficulty: 3,
    motivation: 6,
    opportunity: 7,
  },
];

const font = { regular: "Inter", bold: "Inter-Bold" };

const clampNumber = (value: string, min = 0, max = 10) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.round(parsed)));
};

const toScore = (habit: Habit, kind: HabitKind) => {
  const impactWeight = 3;
  const timeWeight = 2;
  const difficultyWeight = 2;
  const motivationWeight = 1.5;
  const opportunityWeight = 1.5;

  if (kind === "bad") {
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
  if (!form.name.trim()) return null;

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

const includesWord = (left: string, right: string) => {
  const l = left.toLowerCase();
  return right
    .toLowerCase()
    .split(/\s+/)
    .some((part) => part.length > 3 && l.includes(part));
};

const readStorage = (key: string) => {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
};

const writeStorage = (key: string, value: string) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
};

export default function Index() {
  const scheme = useColorScheme() ?? "light";
  const c = scheme === "dark" ? dark : light;
  const insets = useSafeAreaInsets();

  const [badHabits, setBadHabits] = useState<Habit[]>(initialBad);
  const [goodHabits, setGoodHabits] = useState<Habit[]>(initialGood);
  const [badForm, setBadForm] = useState<HabitForm>(emptyForm);
  const [goodForm, setGoodForm] = useState<HabitForm>(emptyForm);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    const saved = readStorage(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as { badHabits: Habit[]; goodHabits: Habit[] };
      if (parsed?.badHabits?.length) setBadHabits(parsed.badHabits);
      if (parsed?.goodHabits?.length) setGoodHabits(parsed.goodHabits);
    }
    const onboardingDone = readStorage(ONBOARDING_KEY) === "done";
    setTutorialOpen(!onboardingDone);
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEY, JSON.stringify({ badHabits, goodHabits }));
  }, [badHabits, goodHabits]);

  const rankedBad = useMemo(
    () => [...badHabits].sort((a, b) => toScore(b, "bad") - toScore(a, "bad")),
    [badHabits],
  );
  const rankedGood = useMemo(
    () => [...goodHabits].sort((a, b) => toScore(b, "good") - toScore(a, "good")),
    [goodHabits],
  );

  const swapSuggestions = useMemo(() => {
    return rankedBad.slice(0, 4).map((badHabit) => {
      const replacement = rankedGood
        .map((goodHabit) => {
          const rewardMatch = includesWord(goodHabit.reward, badHabit.reward) ? 2 : 0;
          const cueMatch = includesWord(goodHabit.cue, badHabit.cue) ? 1 : 0;
          const timePenalty = Math.abs(goodHabit.timeMinutes - badHabit.timeMinutes) / 20;
          const compatibility = toScore(goodHabit, "good") + rewardMatch + cueMatch - timePenalty;
          return { goodHabit, compatibility };
        })
        .sort((a, b) => b.compatibility - a.compatibility)[0]?.goodHabit;

      return { badHabit, replacement };
    });
  }, [rankedBad, rankedGood]);

  const tutorialCard = tutorial[tutorialStep];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: c.bg }]} edges={["top", "left", "right"]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: Math.max(70, insets.bottom + 28), backgroundColor: c.bg },
        ]}>
        <View style={[styles.hero, { backgroundColor: c.glass, borderColor: c.border }]}> 
          <Text style={[styles.title, { color: c.text }]}>HabitSwap</Text>
          <Text style={[styles.subtitle, { color: c.subtle }]}>Modernes Habit-Design mit Grid, Smart-Scoring und Habit-Ersatz statt reiner Disziplin.</Text>
        </View>

        <View style={[styles.panel, { backgroundColor: c.glass, borderColor: c.border }]}> 
          <Text style={[styles.panelTitle, { color: c.text }]}>Konzept: Warum HabitSwap funktioniert</Text>
          <Text style={[styles.body, { color: c.subtle }]}>Die App optimiert nicht nur Ziele, sondern die Struktur hinter Gewohnheiten: Trigger (Cue), Belohnung (Reward) und Aufwand. Schlechte Routinen werden nicht "gelöscht", sondern durch kompatible bessere Alternativen ersetzt.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: c.text }]}>Top Habit-Swaps</Text>
        <View style={styles.grid}>
          {swapSuggestions.map(({ badHabit, replacement }) => (
            <View key={badHabit.id} style={[styles.gridCard, { backgroundColor: c.glassStrong, borderColor: c.border }]}> 
              <Text style={[styles.swapHeadline, { color: c.bad }]}>❌ {badHabit.name}</Text>
              <Text style={[styles.swapArrow, { color: c.good }]}>↳ ✅ {replacement?.name || "Noch kein Match"}</Text>
              <Text style={[styles.metric, { color: c.subtle }]}>Cue: {badHabit.cue || "—"}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.panel, { backgroundColor: c.glass, borderColor: c.border }]}> 
          <Text style={[styles.panelTitle, { color: c.text }]}>Schlechte Habit hinzufügen</Text>
          <Form form={badForm} setForm={setBadForm} colors={c} />
          <ActionButton
            label="Schlechte Habit speichern"
            color={c.badButton}
            onPress={() => {
              const parsed = parseHabit(badForm);
              if (!parsed) return;
              setBadHabits((old) => [parsed, ...old]);
              setBadForm(emptyForm);
            }}
          />
        </View>

        <View style={[styles.panel, { backgroundColor: c.glass, borderColor: c.border }]}> 
          <Text style={[styles.panelTitle, { color: c.text }]}>Gute Habit hinzufügen</Text>
          <Form form={goodForm} setForm={setGoodForm} colors={c} />
          <ActionButton
            label="Gute Habit speichern"
            color={c.goodButton}
            onPress={() => {
              const parsed = parseHabit(goodForm);
              if (!parsed) return;
              setGoodHabits((old) => [parsed, ...old]);
              setGoodForm(emptyForm);
            }}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: c.text }]}>Schlechte Habits (Grid)</Text>
        <HabitGrid habits={rankedBad} kind="bad" colors={c} onDelete={(id) => setBadHabits((old) => old.filter((h) => h.id !== id))} />

        <Text style={[styles.sectionTitle, { color: c.text }]}>Gute Habits (Grid)</Text>
        <HabitGrid habits={rankedGood} kind="good" colors={c} onDelete={(id) => setGoodHabits((old) => old.filter((h) => h.id !== id))} />
      </ScrollView>

      {tutorialOpen ? (
        <View style={styles.overlay}>
          <View style={[styles.tutorialCard, { backgroundColor: c.glassStrong, borderColor: c.border }]}> 
            <Text style={[styles.panelTitle, { color: c.text }]}>{tutorialCard.title}</Text>
            <Text style={[styles.body, { color: c.subtle }]}>{tutorialCard.text}</Text>
            <View style={styles.row}>
              <ActionButton
                label="Überspringen"
                color={c.mutedButton}
                onPress={() => {
                  writeStorage(ONBOARDING_KEY, "done");
                  setTutorialOpen(false);
                }}
              />
              <ActionButton
                label={tutorialStep === tutorial.length - 1 ? "Los geht's" : "Weiter"}
                color={c.goodButton}
                onPress={() => {
                  if (tutorialStep === tutorial.length - 1) {
                    writeStorage(ONBOARDING_KEY, "done");
                    setTutorialOpen(false);
                    return;
                  }
                  setTutorialStep((step) => step + 1);
                }}
              />
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function HabitGrid({
  habits,
  kind,
  colors,
  onDelete,
}: {
  habits: Habit[];
  kind: HabitKind;
  colors: ReturnType<typeof buildColors>;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.grid}>
      {habits.map((habit) => (
        <View key={habit.id} style={[styles.gridCard, { backgroundColor: colors.glassStrong, borderColor: colors.border }]}> 
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{habit.name}</Text>
            <Pressable onPress={() => onDelete(habit.id)}>
              <Text style={[styles.delete, { color: colors.bad }]}>Löschen</Text>
            </Pressable>
          </View>
          <Text style={[styles.metric, { color: colors.subtle }]}>Cue: {habit.cue || "—"}</Text>
          <Text style={[styles.metric, { color: colors.subtle }]}>Reward: {habit.reward || "—"}</Text>
          <Text style={[styles.metric, { color: colors.subtle }]}>Zeit: {habit.timeMinutes} Min</Text>
          <Text style={[styles.score, { color: kind === "bad" ? colors.bad : colors.good }]}>Score: {toScore(habit, kind).toFixed(1)}</Text>
        </View>
      ))}
    </View>
  );
}

function Form({
  form,
  setForm,
  colors,
}: {
  form: HabitForm;
  setForm: React.Dispatch<React.SetStateAction<HabitForm>>;
  colors: ReturnType<typeof buildColors>;
}) {
  return (
    <>
      <FormField label="Name" value={form.name} colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, name: value }))} />
      <FormField label="Cue / Trigger" value={form.cue} colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, cue: value }))} />
      <FormField label="Reward" value={form.reward} colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, reward: value }))} />
      <FormField label="Impact/Nutzen (0-10)" value={form.impact} keyboardType="numeric" colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, impact: value }))} />
      <FormField label="Zeit (Min/Tag)" value={form.timeMinutes} keyboardType="numeric" colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, timeMinutes: value }))} />
      <FormField label="Schwierigkeit (0-10)" value={form.difficulty} keyboardType="numeric" colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, difficulty: value }))} />
      <FormField label="Motivation (0-10)" value={form.motivation} keyboardType="numeric" colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, motivation: value }))} />
      <FormField label="Opportunity (0-10)" value={form.opportunity} keyboardType="numeric" colors={colors} onChangeText={(value) => setForm((old) => ({ ...old, opportunity: value }))} />
    </>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  colors,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof buildColors>;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.formField}>
      <Text style={[styles.label, { color: colors.subtle }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.input }]}
        placeholder={label}
        placeholderTextColor={colors.placeholder}
      />
    </View>
  );
}

function ActionButton({ label, onPress, color }: { label: string; onPress: () => void; color: string }) {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const buildColors = (darkMode: boolean) => ({
  bg: darkMode ? "#040712" : "#eef2ff",
  text: darkMode ? "#f8fafc" : "#0f172a",
  subtle: darkMode ? "#cbd5e1" : "#334155",
  border: darkMode ? "rgba(148,163,184,0.25)" : "rgba(71,85,105,0.2)",
  glass: darkMode ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.72)",
  glassStrong: darkMode ? "rgba(15,23,42,0.78)" : "rgba(255,255,255,0.86)",
  input: darkMode ? "rgba(30,41,59,0.65)" : "rgba(255,255,255,0.92)",
  placeholder: darkMode ? "#94a3b8" : "#64748b",
  good: "#22c55e",
  bad: "#fb7185",
  goodButton: "#16a34a",
  badButton: "#dc2626",
  mutedButton: "#64748b",
});

const dark = buildColors(true);
const light = buildColors(false);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  hero: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  title: { fontSize: 33, fontFamily: font.bold, fontWeight: "800" },
  subtitle: { marginTop: 8, lineHeight: 21, fontFamily: font.regular },
  panel: { borderRadius: 20, borderWidth: 1, padding: 14 },
  panelTitle: { fontSize: 18, fontFamily: font.bold, fontWeight: "700", marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "800", fontFamily: font.bold, marginTop: 4 },
  body: { lineHeight: 21, fontFamily: font.regular },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridCard: { width: "48%", borderWidth: 1, borderRadius: 16, padding: 11 },
  swapHeadline: { fontFamily: font.bold, fontWeight: "700" },
  swapArrow: { marginTop: 4, fontFamily: font.bold, fontWeight: "700" },
  metric: { marginTop: 4, fontFamily: font.regular, fontSize: 13 },
  score: { marginTop: 8, fontFamily: font.bold, fontWeight: "700" },
  cardHeader: { flexDirection: "row", gap: 6, justifyContent: "space-between", alignItems: "flex-start" },
  cardTitle: { flex: 1, fontFamily: font.bold, fontWeight: "700" },
  delete: { fontFamily: font.bold, fontWeight: "700", fontSize: 12 },
  formField: { marginBottom: 8 },
  label: { marginBottom: 4, fontSize: 12, fontFamily: font.regular },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, fontFamily: font.regular },
  button: { borderRadius: 12, marginTop: 8, paddingVertical: 12, alignItems: "center", minWidth: 120 },
  buttonText: { color: "white", fontFamily: font.bold, fontWeight: "700" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,6,23,0.5)",
    justifyContent: "center",
    padding: 18,
  },
  tutorialCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
});
