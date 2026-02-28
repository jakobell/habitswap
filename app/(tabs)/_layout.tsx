import { Tabs } from 'expo-router';
import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { HapticTab } from '@/components/haptic-tab';
import { HabitProvider } from '@/context/habit-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              color={focused ? c.active : c.inactive}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="swaps"
        options={{
          title: 'Swaps',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'swap-horizontal-bold' : 'swap-horizontal'}
              color={focused ? c.active : c.inactive}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'target' : 'target-variant'}
              color={focused ? c.active : c.inactive}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Visuals',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'shape' : 'shape-outline'}
              color={focused ? c.active : c.inactive}
              size={28}
            />
          ),
        }}
      />
      </Tabs>
    </HabitProvider>
  );
}
