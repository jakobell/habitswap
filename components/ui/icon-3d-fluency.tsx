import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export type Icon3DFluencyName = 'dashboard' | 'swap' | 'focus' | 'visuals';

const iconMap: Record<Icon3DFluencyName, string> = {
  dashboard: 'https://img.icons8.com/3d-fluency/188/combo-chart.png',
  swap: 'https://img.icons8.com/3d-fluency/188/synchronize.png',
  focus: 'https://img.icons8.com/3d-fluency/188/brain.png',
  visuals: 'https://img.icons8.com/3d-fluency/188/paint-palette.png',
};

type Icon3DFluencyProps = {
  name: Icon3DFluencyName;
  focused: boolean;
};

export function Icon3DFluency({ name, focused }: Icon3DFluencyProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: iconMap[name] }}
        style={[styles.image, !focused && styles.inactive]}
        contentFit="contain"
        transition={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  inactive: {
    opacity: 0.55,
    transform: [{ scale: 0.95 }],
  },
});
