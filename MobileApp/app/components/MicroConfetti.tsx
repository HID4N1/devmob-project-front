import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, View } from 'react-native';

export default function MicroConfetti({ show, duration = 900 }: { show: boolean; duration?: number }) {
  const dots = useMemo(() => new Array(8).fill(0).map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    o: new Animated.Value(0),
    s: new Animated.Value(0.6),
    c: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
  })), [show]);

  useEffect(() => {
    if (!show) return;
    const anims = dots.map((d) => Animated.parallel([
      Animated.timing(d.o, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(d.s, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(d.x, { toValue: (Math.random() - 0.5) * 60, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(d.y, { toValue: -40 - Math.random() * 40, duration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]));
    Animated.stagger(40, anims).start();
  }, [show]);

  if (!show) return null;
  return (
    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: d.c as any,
          opacity: d.o,
          transform: [{ translateX: d.x }, { translateY: d.y }, { scale: d.s }],
          margin: 2,
          position: 'absolute'
        }} />
      ))}
    </View>
  );
}