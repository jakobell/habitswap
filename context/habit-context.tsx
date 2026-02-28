import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Habit, HabitKind, initialBad, initialGood } from '@/lib/habits';

type HabitState = {
  badHabits: Habit[];
  goodHabits: Habit[];
  addHabit: (kind: HabitKind, habit: Habit) => void;
  deleteHabit: (kind: HabitKind, id: string) => void;
};

const STORAGE_KEY = 'habitswap:data:v2';

const HabitContext = createContext<HabitState | null>(null);

const readStorage = (key: string) => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
};

const writeStorage = (key: string, value: string) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, value);
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [badHabits, setBadHabits] = useState<Habit[]>(initialBad);
  const [goodHabits, setGoodHabits] = useState<Habit[]>(initialGood);

  useEffect(() => {
    const saved = readStorage(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved) as { badHabits?: Habit[]; goodHabits?: Habit[] };
    if (parsed.badHabits?.length) setBadHabits(parsed.badHabits);
    if (parsed.goodHabits?.length) setGoodHabits(parsed.goodHabits);
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEY, JSON.stringify({ badHabits, goodHabits }));
  }, [badHabits, goodHabits]);

  const value = useMemo(
    () => ({
      badHabits,
      goodHabits,
      addHabit: (kind: HabitKind, habit: Habit) => {
        if (kind === 'bad') {
          setBadHabits((old) => [habit, ...old]);
          return;
        }
        setGoodHabits((old) => [habit, ...old]);
      },
      deleteHabit: (kind: HabitKind, id: string) => {
        if (kind === 'bad') {
          setBadHabits((old) => old.filter((h) => h.id !== id));
          return;
        }
        setGoodHabits((old) => old.filter((h) => h.id !== id));
      },
    }),
    [badHabits, goodHabits],
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabitStore() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitStore must be used inside HabitProvider');
  }
  return context;
}
