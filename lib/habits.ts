export type HabitKind = 'bad' | 'good';
export type MotivationType = 'intrinsic' | 'extrinsic' | 'mixed';

export type Habit = {
  id: string;
  name: string;
  cue: string;
  reward: string;
  prompt: string;
  impact: number;
  timeMinutes: number;
  difficulty: number;
  motivation: number;
  capability: number;
  opportunity: number;
  motivationType: MotivationType;
};

export type HabitForm = {
  name: string;
  cue: string;
  reward: string;
  prompt: string;
  impact: string;
  timeMinutes: string;
  difficulty: string;
  motivation: string;
  capability: string;
  opportunity: string;
  motivationType: MotivationType;
};

export const emptyForm: HabitForm = {
  name: '',
  cue: '',
  reward: '',
  prompt: '',
  impact: '5',
  timeMinutes: '15',
  difficulty: '5',
  motivation: '5',
  capability: '5',
  opportunity: '5',
  motivationType: 'mixed',
};

export const initialBad: Habit[] = [
  {
    id: 'bad-1',
    name: 'Endloses Social Media Scrollen',
    cue: 'Abend auf dem Sofa / Müdigkeit',
    reward: 'Schneller Dopamin-Kick, Ablenkung',
    prompt: '22:00 Reminder: Gerät weglegen',
    impact: 7,
    timeMinutes: 90,
    difficulty: 8,
    motivation: 7,
    capability: 6,
    opportunity: 9,
    motivationType: 'extrinsic',
  },
];

export const initialGood: Habit[] = [
  {
    id: 'good-1',
    name: '10 Minuten Spaziergang',
    cue: 'Nachmittags-Pause im Kalender',
    reward: 'Stressabbau und Klarheit',
    prompt: '15:30 Block im Kalender',
    impact: 8,
    timeMinutes: 10,
    difficulty: 3,
    motivation: 6,
    capability: 7,
    opportunity: 7,
    motivationType: 'intrinsic',
  },
];

const clampNumber = (value: string, min = 0, max = 10) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, Math.round(parsed)));
};

export const parseHabit = (form: HabitForm): Habit | null => {
  if (!form.name.trim()) return null;

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: form.name.trim(),
    cue: form.cue.trim(),
    reward: form.reward.trim(),
    prompt: form.prompt.trim(),
    impact: clampNumber(form.impact),
    timeMinutes: clampNumber(form.timeMinutes, 1, 240),
    difficulty: clampNumber(form.difficulty),
    motivation: clampNumber(form.motivation),
    capability: clampNumber(form.capability),
    opportunity: clampNumber(form.opportunity),
    motivationType: form.motivationType,
  };
};

export const toScore = (habit: Habit, kind: HabitKind) => {
  const impactWeight = 3;
  const timeWeight = 2;
  const difficultyWeight = 2;
  const motivationWeight = 1.5;
  const capabilityWeight = 1.5;
  const opportunityWeight = 1.5;

  if (kind === 'bad') {
    return (
      habit.impact * impactWeight +
      (habit.timeMinutes / 10) * timeWeight +
      habit.difficulty * difficultyWeight +
      habit.motivation * motivationWeight +
      habit.capability * capabilityWeight +
      habit.opportunity * opportunityWeight
    );
  }

  return (
    habit.impact * impactWeight +
    ((60 - habit.timeMinutes) / 10) * timeWeight +
    (10 - habit.difficulty) * difficultyWeight +
    habit.motivation * motivationWeight +
    habit.capability * capabilityWeight +
    habit.opportunity * opportunityWeight
  );
};

export const includesWord = (left: string, right: string) => {
  const l = left.toLowerCase();
  return right
    .toLowerCase()
    .split(/\s+/)
    .some((part) => part.length > 3 && l.includes(part));
};

export const motivationTypeLabel: Record<MotivationType, string> = {
  intrinsic: 'intrinsisch',
  extrinsic: 'extrinsisch',
  mixed: 'gemischt',
};

export const rankHabits = (habits: Habit[], kind: HabitKind) =>
  [...habits].sort((a, b) => toScore(b, kind) - toScore(a, kind));

export const buildSwapSuggestions = (badHabits: Habit[], goodHabits: Habit[]) => {
  const rankedBad = rankHabits(badHabits, 'bad');
  const rankedGood = rankHabits(goodHabits, 'good');

  return rankedBad.map((badHabit) => {
    const replacement = rankedGood
      .map((goodHabit) => {
        const rewardMatch = includesWord(goodHabit.reward, badHabit.reward) ? 2 : 0;
        const cueMatch = includesWord(goodHabit.cue, badHabit.cue) ? 1 : 0;
        const timePenalty = Math.abs(goodHabit.timeMinutes - badHabit.timeMinutes) / 20;
        const compatibility = toScore(goodHabit, 'good') + rewardMatch + cueMatch - timePenalty;
        return { goodHabit, compatibility };
      })
      .sort((a, b) => b.compatibility - a.compatibility)[0]?.goodHabit;

    return { badHabit, replacement };
  });
};
