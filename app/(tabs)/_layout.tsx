import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { HabitProvider } from '@/context/habit-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon3DFluency } from '@/components/ui/icon-3d-fluency';

const palette = {
  light: {
    background: '#F5F7FB',
    active: '#5B5CF0',
    inactive: '#8890A6',
    tabBar: '#FFFFFF',
    border: '#E5E8F0',
  },
  dark: {
    background: '#0F1118',
    active: '#8C94FF',
    inactive: '#6B7390',
    tabBar: '#171A24',
    border: '#23283A',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const c = palette[colorScheme];

  return (
    <HabitProvider>
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 72,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: c.border,
          backgroundColor: c.tabBar,
          position: 'absolute',
        },
        sceneStyle: {
          backgroundColor: c.background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <Icon3DFluency name="dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="swaps"
        options={{
          title: 'Swaps',
          tabBarIcon: ({ focused }) => <Icon3DFluency name="swap" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ focused }) => <Icon3DFluency name="focus" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Visuals',
          tabBarIcon: ({ focused }) => <Icon3DFluency name="visuals" focused={focused} />,
        }}
      />
      </Tabs>
    </HabitProvider>
  );
}
