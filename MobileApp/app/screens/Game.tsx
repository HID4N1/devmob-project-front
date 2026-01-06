import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, Animated, Easing, Pressable, Share, Image, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NeonButton from '../components/NeonButton';
import { styles } from './Game.styles';
import { useLocalSearchParams, router } from 'expo-router';
import { GameService } from '../services/GameService';

export type GameParams = {
  ticketNumber: string;
  agentId: string;
  numbers: number[];
  ticketId: string;
};

export default function Game({ navigation }: { navigation: any }) {
  const { ticketNumber = '', agentId = '007', numbers: numbersParam, ticketId } = useLocalSearchParams<{ ticketNumber?: string; agentId?: string; numbers?: string; ticketId?: string }>();
  const numbers = numbersParam ? JSON.parse(numbersParam) : [];
  const { width, height } = useWindowDimensions();
  const base = Math.min(width, height);
  const reelSize = Math.max(64, Math.min(120, Math.round(base * 0.18)));
  const cellH = reelSize;
  const viewportH = cellH * 3;
  const digitFont = Math.round(reelSize * 0.8);

  const reels = 4;
  const digits = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), []);
  const extended = useMemo(() => [...digits, ...digits, ...digits, ...digits, ...digits], [digits]);
  const extendedLength = extended.length; // 45

  const [phase, setPhase] = useState<'idle' | 'spinning' | 'result'>('idle');
  const [result, setResult] = useState<number[]>(Array(reels).fill(0));
  const [luckyCombo, setLuckyCombo] = useState<string>('0000');
  const [hasWon, setHasWon] = useState<boolean>(false);
  const animY = useRef(Array.from({ length: reels }, () => new Animated.Value(0))).current;
  const blink = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const confettiKey = useRef(0);
  const loopsRef = useRef<(Animated.CompositeAnimation | null)[]>(Array(reels).fill(null));
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultPulse = useRef(new Animated.Value(1)).current;
  const winningOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animY.forEach(v => v.setValue(0));
  }, [cellH]);

  useEffect(() => {
    // pulsating launch button when idle
    pulse.stopAnimation();
    pulse.setValue(1);
    if (phase === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.0, duration: 800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [phase, pulse]);

  useEffect(() => {
    // subtle pulse for the revealed result, matching glow vibe
    resultPulse.stopAnimation();
    resultPulse.setValue(1);
    if (phase === 'result') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(resultPulse, { toValue: 1.04, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(resultPulse, { toValue: 1.0, duration: 650, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [phase, resultPulse]);

  const startSpin = async () => {
    if (phase !== 'idle' || !ticketId) return;
    setPhase('spinning');

    let targets: number[] = [];
    let hasWonLocal = false;
    let giftLocal = '';

    try {
      // Call backend to play the game
      const response = await GameService.playTicket(parseInt(ticketId));
      const { winning_numbers, has_won, gift } = response;
      targets = winning_numbers;
      hasWonLocal = has_won;
      giftLocal = gift;
      setResult(targets);
      setHasWon(has_won);

      // 10s global progress
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true }).start();

      const period = cellH * extendedLength; // fixed cycle length for extended array

      // start continuous loops for each reel (no blanks)
      for (let i = 0; i < reels; i++) {
        // start at 0 for perfectly seamless loop resets
        animY[i].setValue(0);
        const loop = Animated.loop(
          Animated.timing(animY[i], {
            toValue: -period,
            duration: 600 + i * 80, // Faster and smoother
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        );
        loopsRef.current[i] = loop;
        loop.start(() => {});
      }

      // after 10s, stop loops and decelerate to exact targets sequentially
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = setTimeout(() => {
        // stop loops and normalize position
        for (let i = 0; i < reels; i++) {
          loopsRef.current[i]?.stop?.();
          // normalize current into [-period, 0]
          const val = (animY[i] as any).__getValue?.() ?? 0;
          let norm = val % period;
          if (norm > 0) norm -= period; // keep within [-period,0]
          animY[i].setValue(norm);
        }

        const decels: Promise<void>[] = [];
        for (let i = 0; i < reels; i++) {
          decels.push(
            new Promise((resolve) => {
              setTimeout(() => {
                const current = (animY[i] as any).__getValue?.() ?? 0; // negative value
                const targetPos = -(targets[i] - 2) * cellH; // center the winning digit in the middle
                // choose a final position that continues downward to target
                const k = Math.ceil((current - targetPos) / period);
                const finalTo = targetPos - k * period;
                // Create a new Animated.Value for JS-driven animation to avoid native driver conflict
                const jsAnim = new Animated.Value(current);
                animY[i].setValue(current);
                Animated.timing(jsAnim, {
                  toValue: finalTo,
                  duration: 2000 + i * 300,
                  easing: Easing.bezier(0.22, 1, 0.36, 1),
                  useNativeDriver: false,
                }).start((endResult: {finished: boolean}) => {
                  if (endResult.finished) {
                    animY[i].setValue(finalTo);
                    resolve();
                  }
                });
              }, i * 300); // staggered stops
            })
          );
        }

        Promise.all(decels).then(() => {
          // snap precisely to center positions to avoid any subpixel drift
          const period = cellH * extendedLength;
          for (let i = 0; i < reels; i++) {
            const targetPos = -(targets[i] - 2) * cellH;
            let snapped = targetPos % period;
            if (snapped > 0) snapped -= period;
            animY[i].setValue(snapped);
          }

          // show result immediately after reels are visually stopped and centered
          setResult(targets);
          setLuckyCombo(`${targets[0]}${targets[1]}${targets[2]}${targets[3]}`);
          setPhase('result');
          confettiKey.current += 1;
          winningOpacity.setValue(0);
          Animated.timing(winningOpacity, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }).start();

          // Redirect to Result screen after a short delay
          setTimeout(() => {
            router.push({
              pathname: '/screens/Result',
              params: {
                ticketNumber: ticketNumber || '',
                agentId: agentId || '',
                numbers: JSON.stringify(numbers),
                result: JSON.stringify(targets),
                hasWon: hasWonLocal.toString(),
                luckyCombo: `${targets[0]}${targets[1]}${targets[2]}${targets[3]}`,
                gift: giftLocal || '',
                ticketId: ticketId || '',
              },
            });
          }, 3000); // 3 seconds delay to show the winning numbers
        });
      }, 10000);
    } catch (error) {
      console.error('Error playing game:', error);
      // Fallback to local simulation if backend fails: generate random numbers and check if they match player's numbers
      targets = Array.from({ length: reels }, () => Math.floor(Math.random() * 9) + 1);
      hasWonLocal = targets.every((num, index) => num === numbers[index]);
      giftLocal = hasWonLocal ? 'Porte-clés' : '';
      setResult(targets);
      setHasWon(hasWonLocal);
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true }).start();

      const period = cellH * extendedLength;
      for (let i = 0; i < reels; i++) {
        animY[i].setValue(0);
        const loop = Animated.loop(
          Animated.timing(animY[i], {
            toValue: -period,
            duration: 600 + i * 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        );
        loopsRef.current[i] = loop;
        loop.start(() => {});
      }

      // after 10s, stop loops and decelerate to exact targets sequentially
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = setTimeout(() => {
        // stop loops and normalize position
        for (let i = 0; i < reels; i++) {
          loopsRef.current[i]?.stop?.();
          // normalize current into [-period, 0]
          const val = (animY[i] as any).__getValue?.() ?? 0;
          let norm = val % period;
          if (norm > 0) norm -= period; // keep within [-period,0]
          animY[i].setValue(norm);
        }

        const decels: Promise<void>[] = [];
        for (let i = 0; i < reels; i++) {
          decels.push(
            new Promise((resolve) => {
              setTimeout(() => {
                const current = (animY[i] as any).__getValue?.() ?? 0; // negative value
                const targetPos = -(targets[i] - 2) * cellH; // center the winning digit in the middle
                // choose a final position that continues downward to target
                const k = Math.ceil((current - targetPos) / period);
                const finalTo = targetPos - k * period;
                // Create a new Animated.Value for JS-driven animation to avoid native driver conflict
                const jsAnim = new Animated.Value(current);
                animY[i].setValue(current);
                Animated.timing(jsAnim, {
                  toValue: finalTo,
                  duration: 2000 + i * 300,
                  easing: Easing.bezier(0.22, 1, 0.36, 1),
                  useNativeDriver: false,
                }).start((endResult: {finished: boolean}) => {
                  if (endResult.finished) {
                    animY[i].setValue(finalTo);
                    resolve();
                  }
                });
              }, i * 300); // staggered stops
            })
          );
        }

        Promise.all(decels).then(() => {
          // snap precisely to center positions to avoid any subpixel drift
          const period = cellH * extendedLength;
          for (let i = 0; i < reels; i++) {
            const targetPos = -(targets[i] - 2) * cellH;
            let snapped = targetPos % period;
            if (snapped > 0) snapped -= period;
            animY[i].setValue(snapped);
          }

          blink.setValue(1);
          Animated.sequence([
            Animated.timing(blink, { toValue: 0.2, duration: 80, useNativeDriver: true }),
            Animated.timing(blink, { toValue: 1, duration: 80, useNativeDriver: true }),
          ]).start(() => {
            // show result just after reels are visually stopped and centered
            setTimeout(() => {
              // recompute visible digits from current positions to avoid any mismatch
              const periodNow = cellH * extendedLength;
              const visible = animY.map((v) => {
                const val = (v as any).__getValue?.() ?? 0; 
                const idx = Math.floor(((-val + cellH) / cellH)) % extendedLength;
                return extended[idx];
              });
              setResult(targets);
              setLuckyCombo(`${targets[0]}${targets[1]}${targets[2]}${targets[3]}`);
              setPhase('result');
              confettiKey.current += 1;
              winningOpacity.setValue(0);
              Animated.timing(winningOpacity, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }).start();

              // Redirect to Result screen after a short delay
              setTimeout(() => {
                router.push({
                  pathname: '/screens/Result',
                  params: {
                    ticketNumber: ticketNumber || '',
                    agentId: agentId || '',
                    numbers: JSON.stringify(numbers),
                    result: JSON.stringify(targets),
                    hasWon: hasWonLocal.toString(),
                    luckyCombo: `${targets[0]}${targets[1]}${targets[2]}${targets[3]}`,
                    gift: giftLocal,
                    ticketId: ticketId || '',
                  },
                });
              }, 3000); 
            }, 180);
          });
        });
      }, 10000);
    }
  };


  return (
    <LinearGradient
      colors={["#00172D", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        bounces={false}
      >
        <View style={styles.container}>
          {/* floating glow orbs */}
          <View pointerEvents="none" style={styles.bgDecorWrap}>
            <View
              style={[
                styles.sparkle,
                { top: 60, right: 40, width: 180, height: 180, backgroundColor: "rgba(0,255,255,0.15)" },
              ]}
            />
            <View
              style={[
                styles.sparkle,
                { bottom: 100, left: 30, width: 220, height: 220, backgroundColor: "rgba(255,255,255,0.05)" },
              ]}
            />
            <View
              style={[
                styles.sparkle,
                { top: 200, left: 100, width: 120, height: 120, backgroundColor: "rgba(255,215,0,0.1)" },
              ]}
            />
          </View>
  
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
  
          <View style={[styles.panel, { width: Math.min(width * 0.9, 840) }]}>
              {/* quatro logo */}
            <Image
              source={require('../../assets/images/Quatro-logo-2.png')}
              style={{ width: 260, height: 100, alignSelf: 'center', borderRadius: 12}}
              resizeMode="contain"
            />
            <View style={styles.reelsRow}>
            {Array.from({ length: reels }).map((_, i) => (
  <React.Fragment key={`slot-${i}`}>
    <View style={[styles.reelWindow, { height: viewportH, position: 'relative' }]}>
      <LinearGradient
        colors={["#071A2C", "#000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.reelGrad}
        pointerEvents="none"
      />

      <Animated.View
        style={{
          width: "100%",
          transform: [{ translateY: animY[i] }],
        }}
      >
        {extended.map((n, di) => (
          <View
            key={`d-${i}-${di}`}
            style={[
              di === 1 ? styles.middleDigitCell : styles.digitCell,
              {
                height: cellH,
                width: "100%",
                transform: [{ scale: n === result[i] ? 1.1 : 1 }],
              },
            ]}
          >
            <Text
              style={[
                styles.digitText,
                { fontSize: digitFont, lineHeight: digitFont },
              ]}
              allowFontScaling={false}
            >
              {n}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* 🔹 Highlight Border for Middle (Winning) Row */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: cellH, 
          left: 0,
          right: 0,
          height: cellH,
          borderWidth: 3,
          borderColor: '#FFD700', 
          borderRadius: 8,
          shadowColor: '#FFD700',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          transform: [{ scale: resultPulse }], 
          opacity: phase === 'result' ? 1 : 0.5,
          zIndex: 10,
        }}
      />
    </View>
    {i < reels - 1 && <View style={styles.reelSep} />}
  </React.Fragment>
))}

            </View>
  
            <View style={styles.progressWrap}>
              <Animated.View
                style={[styles.progressFill, { transform: [{ scaleX: progress }] }]}
              />
              <Animated.View style={{ transform: [{ scale: pulse }], marginTop: 16 }}>
                <NeonButton
                  title={phase === "spinning" ? "Tirage en cours..." : "Lancer le tirage"}
                  onPress={startSpin}
                  variant="blue"
                  icon="🚀"
                  style={styles.neonBtn}
                />
              </Animated.View>
            </View>
  
            {phase === "result" && (
              <Animated.View style={[styles.winningRow, { opacity: winningOpacity }]}>
                <Text style={styles.winningLabel}>Numéros gagnants :</Text>
                <View style={styles.winningNumbers}>
                  {result.map((num, i) => (
                    <Text key={i} style={styles.winningNumber}>
                      {num}
                    </Text>
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
  
}
