import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const assets = [
  { title: 'Move', icon: 'shoe-print', uri: 'https://img.icons8.com/3d-fluency/188/running.png' },
  { title: 'Fuel', icon: 'cup-water', uri: 'https://img.icons8.com/3d-fluency/188/water-bottle.png' },
  { title: 'Sleep', icon: 'power-sleep', uri: 'https://img.icons8.com/3d-fluency/188/sleeping-in-bed.png' },
  { title: 'Focus', icon: 'head-cog', uri: 'https://img.icons8.com/3d-fluency/188/brain.png' },
];

const palette = {
  light: { bg: '#F5F7FB', card: '#FFFFFF', text: '#111827', subtle: '#637087', border: '#E7EAF2', accent: '#5B5CF0' },
  dark: { bg: '#0F1118', card: '#171A24', text: '#EEF1FA', subtle: '#A2ABBF', border: '#252B3D', accent: '#8C94FF' },
};

export default function VisualsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const c = palette[scheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.bg }]}>
      <View style={styles.grid}>
        {assets.map((asset, index) => (
          <Animated.View
            entering={FadeInDown.delay(80 * index + 60).springify()}
            key={asset.title}
            style={[styles.tile, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={styles.tileHeader}>
              <MaterialCommunityIcons name={asset.icon as MaterialIconName} size={18} color={c.accent} />
              <Text style={[styles.tileText, { color: c.text }]}>{asset.title}</Text>
            </View>
            <Image source={{ uri: asset.uri }} style={styles.image} contentFit="contain" transition={250} />
          </Animated.View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  grid: {
    flex: 1,
    padding: 16,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    width: '48.5%',
    borderWidth: 1,
    borderRadius: 22,
    padding: 10,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tileText: { fontSize: 14, fontWeight: '700' },
  image: { width: '100%', height: 120 },
});
