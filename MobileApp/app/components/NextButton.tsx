import React, { useRef } from 'react';
import { Pressable, Animated, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: 'green' | 'blue';
  disabled?: boolean;
};

export default function NextButton({ title = 'Next', onPress, style, color = 'green', disabled = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
  };

  const bg = color === 'blue' ? colors.primaryBlue : colors.green;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : onPressIn}
        onPressOut={disabled ? undefined : onPressOut}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: bg, opacity: pressed && !disabled ? 0.95 : disabled ? 0.5 : 1, borderRadius: 40 }
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});