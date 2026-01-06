import React from 'react';
import { TouchableOpacity, ViewStyle, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './NeonButton.styles';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'blue' | 'green';
  icon?: string;
  style?: ViewStyle;
};


export default function NeonButton({ title, onPress, variant = 'blue', icon, style }: Props) {
  const colors = variant === 'blue'
    ? (['#3B82F6', '#2563EB'] as const)
    : (['#22C55E', '#16A34A'] as const);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[style, { borderRadius: 14 }]}> 
      <LinearGradient colors={colors} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.gradient}>
        <View style={styles.innerRow}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text style={styles.label}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
