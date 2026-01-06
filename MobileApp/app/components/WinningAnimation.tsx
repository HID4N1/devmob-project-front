import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Svg, { Path, Circle, Polygon, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function WinningAnimation() {
  const trophyScale = useSharedValue(0);
  const trophyGlow = useSharedValue(0);
  const textBounce = useSharedValue(0);
  const rayRotation = useSharedValue(0);
  const starPulse = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0);

  useEffect(() => {
    // Trophy scale-up and glow
    trophyScale.value = withTiming(1, { duration: 800, easing: Easing.elastic(1.2) });
    trophyGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.5, { duration: 500 })
      ),
      -1,
      true
    );

    // Text bounce
    textBounce.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 200 }),
          withTiming(0, { duration: 200 })
        ),
        3,
        false
      )
    );

    // Rotating rays
    rayRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );

    // Pulsing stars
    starPulse.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );

    // Sparkles
    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      true
    );
  }, []);

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
    shadowOpacity: trophyGlow.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textBounce.value }],
  }));

  const rayStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rayRotation.value}deg` }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starPulse.value }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Confetti Background */}
      <LottieView
        source={require('../../assets/animations/confetti.json')}
        autoPlay
        loop
        style={styles.confetti}
      />

      {/* Rotating Rays */}
      <Animated.View style={[styles.rayContainer, rayStyle]}>
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.ray,
              {
                transform: [{ rotate: `${i * 45}deg` }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Pulsing Stars */}
      <Animated.View style={[styles.starContainer, starStyle]}>
        {[...Array(5)].map((_, i) => (
          <Svg key={i} width={30} height={30} style={styles.star}>
            <Polygon
              points="15,0 18,11 30,11 21,18 24,30 15,22 6,30 9,18 0,11 12,11"
              fill="#FFD700"
            />
          </Svg>
        ))}
      </Animated.View>

      {/* Sparkles */}
      <Animated.View style={[styles.sparkleContainer, sparkleStyle]}>
        {[...Array(10)].map((_, i) => (
          <Svg key={i} width={20} height={20} style={styles.sparkle}>
            <Path
              d="M10,0 L12,8 L20,8 L14,12 L16,20 L10,14 L4,20 L6,12 L0,8 L8,8 Z"
              fill="#FFFFFF"
            />
          </Svg>
        ))}
      </Animated.View>

      {/* Trophy/Crown */}
      <Animated.View style={[styles.trophyContainer, trophyStyle]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          {/* Trophy Base */}
          <Path
            d="M30,80 L90,80 L85,100 L35,100 Z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="2"
          />
          {/* Trophy Stem */}
          <Rect x="45" y="60" width="30" height="20" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
          {/* Trophy Cup */}
          <Path
            d="M35,40 Q60,20 85,40 L80,60 L40,60 Z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="2"
          />
          {/* Crown */}
          <Path
            d="M20,20 L30,35 L40,25 L50,40 L60,30 L70,45 L80,35 L90,50 L100,40 L95,20 Z"
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth="2"
          />
        </Svg>
      </Animated.View>

      {/* Winning Text */}
      <Animated.Text style={[styles.winningText, textStyle]}>
        🎉 Félicitations ! 🎉
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  confetti: {
    position: 'absolute',
    width: width,
    height: height,
  },
  rayContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ray: {
    position: 'absolute',
    width: 2,
    height: 150,
    backgroundColor: '#FFD700',
    opacity: 0.7,
  },
  starContainer: {
    position: 'absolute',
    top: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
  },
  star: {
    opacity: 0.8,
  },
  sparkleContainer: {
    position: 'absolute',
    width: width,
    height: height,
  },
  sparkle: {
    position: 'absolute',
    opacity: 0.6,
  },
  trophyContainer: {
    shadowColor: '#FFD700',
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  winningText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: 20,
  },
});
