import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TextStyle, ViewStyle, View } from 'react-native';

export type AnimatedIconVariant = 'pulse' | 'wobble' | 'spin';

export default function AnimatedIcon({
  emoji,
  size = 24,
  variant = 'pulse',
  style,
  color,
}: {
  emoji: string;
  size?: number;
  variant?: AnimatedIconVariant;
  style?: ViewStyle | ViewStyle[];
  color?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else if (variant === 'wobble') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(rot, { toValue: 1, duration: 250, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(rot, { toValue: -1, duration: 250, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(rot, { toValue: 0, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else if (variant === 'spin') {
      Animated.loop(
        Animated.timing(rot, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }
  }, [variant]);

  const rotate = rot.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] });
  const spin = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const transform =
    variant === 'pulse'
      ? [{ scale }]
      : variant === 'wobble'
      ? [{ rotate }]
      : [{ rotate: spin }];

  return (
    <Animated.View style={[{ transform }, style]}>
      <Text style={{ fontSize: size, color } as TextStyle}>{emoji}</Text>
    </Animated.View>
  );
}