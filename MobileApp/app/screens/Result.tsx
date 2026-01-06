import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { GameService } from '../services/GameService';

export default function Quattro() {
  const { ticketNumber, agentId, price, age_verified, isQuattroPlus, detaillant, crc } = useLocalSearchParams<{
    ticketNumber?: string;
    agentId?: string;
    price?: string;
    age_verified?: string;
    isQuattroPlus?: string;
    detaillant?: string;
    crc?: string;
  }>();
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '']);

  // Animations
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  const inputAnim = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isValid = numbers.every((num) => num !== '');

  useEffect(() => {
    buttonPulse.stopAnimation();
    buttonPulse.setValue(1);
    if (isValid) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulse, {
            toValue: 1.0,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isValid]);

  useEffect(() => {
    inputAnim.stopAnimation();
    inputAnim.setValue(0.94);
    Animated.spring(inputAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [numbers]);

  const handleNumberChange = (index: number, value: string) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);
    }
  };

  const autoFill = () => {
    const randomNumbers = Array.from({ length: 4 }, () =>
      (Math.floor(Math.random() * 9) + 1).toString()
    );
    setNumbers(randomNumbers);
  };

  const handleNext = async () => {
    if (!isValid) {
      Alert.alert('Erreur', 'Veuillez entrer tous les 4 chiffres.');
      return;
    }

    // Validate extracted data from OCR
    const trimmedTicketNumber = ticketNumber?.trim() || '';
    if (!trimmedTicketNumber) {
      Alert.alert('Erreur', 'Numéro de ticket manquant. Veuillez scanner le ticket à nouveau.');
      return;
    }

    const stake = parseFloat((price || '0').replace(',', '.'));
    if (isNaN(stake) || stake < 5) {
      Alert.alert('Erreur', 'Mise invalide. La mise doit être au moins 5 DH. Veuillez scanner le ticket à nouveau.');
      return;
    }

    try {
      const ageVerified = age_verified === 'true';
      const response = await GameService.createTicket(
        trimmedTicketNumber,
        agentId || '',
        numbers.map((n) => parseInt(n)),
        stake,
        ageVerified,
        isQuattroPlus === 'true'
      );
      const ticketId = response.id;

      router.push({
        pathname: '/screens/Game',
        params: {
          ticketNumber: ticketNumber || '',
          agentId: agentId || '',
          numbers: JSON.stringify(numbers.map((n) => parseInt(n))),
          ticketId: ticketId.toString(),
        },
      });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la création du ticket.');
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <LinearGradient
      colors={['#141e30', '#243b55', '#1e3c72', '#2a5298']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>

        {/* Glass Card Section */}
        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <Image
            source={require('../../assets/images/quatro-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.centerContent}>
            <Text style={styles.title}>Entrez vos 4 chiffres</Text>

            <Animated.View style={[styles.inputsContainer, { transform: [{ scale: inputAnim }] }]}>
              {numbers.map((num, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={num}
                  onChangeText={(value) => handleNumberChange(index, value)}
                  keyboardType="numeric"
                  maxLength={1}
                  placeholder="•"
                  placeholderTextColor="#999"
                />
              ))}
            </Animated.View>

            <TouchableOpacity style={styles.autoFillButton} onPress={autoFill}>
              <Text style={styles.autoFillText}>🎲 Flash</Text>
            </TouchableOpacity>



            <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
              <TouchableOpacity
                style={[styles.nextButton, !isValid && styles.disabledButton]}
                onPress={handleNext}
                disabled={!isValid}
              >
                <Text style={styles.nextText}>Continuer ➡️</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Footer Logo */}
        <Image
          source={require('../../assets/images/LN-logo.png')}
          style={[styles.footerImage, { width: width * 0.9 }]}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    zIndex: 5,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    marginTop: 80,
  },
  logo: {
    width: width * 0.6,
    height: 100,
    marginBottom: 20,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 25,
    letterSpacing: 1.1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
  },
  inputsContainer: {
    flexDirection: 'row',
    width: '85%',
    marginBottom: 30,
    alignContent: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    margin: 4,
  },
  autoFillButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 14,
    marginBottom: 16,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  autoFillText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  nextText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  footerImage: {
    alignSelf: 'center',
    height: 80,
    width: '100%',
  },

});
