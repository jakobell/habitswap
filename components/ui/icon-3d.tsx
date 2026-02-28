import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Icon3DProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  size?: number;
  color: string;
  plate: string;
  shadow: string;
};

export function Icon3D({ name, size = 18, color, plate, shadow }: Icon3DProps) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.shadowLayer, { backgroundColor: shadow }]} />
      <View style={[styles.plate, { backgroundColor: plate }]}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 36,
    height: 36,
    position: 'relative',
  },
  shadowLayer: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.95,
  },
  plate: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 3,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
