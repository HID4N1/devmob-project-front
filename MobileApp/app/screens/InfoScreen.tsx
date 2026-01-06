import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image, Animated, Easing, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import AnimatedIcon from '../components/AnimatedIcon';
import NextButton from '../components/NextButton';
import OcrButton from '../components/OcrButton';
import Condition from '../components/condition';
import { colors } from '../theme/colors';
import { styles } from './InfoScreen.styles';
import { AuthService } from '../services/AuthService';
import { GiftService, Gift } from '../services/GiftService';
import { API_BASE_URL } from '../services/config';
import type { TicketData } from '../services/OcrService';

export default function InfoScreen() {
  const [ticket, setTicket] = useState({ number: '', age_verified: false });
  const [price, setPrice] = useState('');
  const [agentId, setAgentId] = useState('');
  const [posName, setPosName] = useState('');
  const [detaillant, setDetaillant] = useState('');
  const [crc, setCrc] = useState('');
  const [focused, setFocused] = useState<'ticket' | 'price' | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableGifts, setAvailableGifts] = useState<Gift[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [ticketExists, setTicketExists] = useState<boolean | null>(null);
  const [checkingTicket, setCheckingTicket] = useState(false);
  const [isQuattroPlus, setIsQuattroPlus] = useState(false);
  const groupedGifts = useMemo(() => {
    const groups: Record<string, Gift[]> = {};
    availableGifts.forEach(gift => {
      if (!groups[gift.range]) groups[gift.range] = [];
      groups[gift.range].push(gift);
    });
    const sortedGroups = Object.values(groups).sort((a, b) => b[0].range.localeCompare(a[0].range));
    return sortedGroups;
  }, [availableGifts]);
  const ticketValid = useMemo(() => ticket.number.trim().length >= 25, [ticket.number]);

  const parsedPrice = useMemo(() => parseFloat(price.replace(',', '.')) || 0, [price]);
  const priceValid = useMemo(() => parsedPrice >= 5, [parsedPrice]);
  const nextDisabled = useMemo(() => !ticket.number || !priceValid || !termsAccepted || ticketExists === true || checkingTicket, [ticket.number, priceValid, termsAccepted, ticketExists, checkingTicket]);




  const goNext = () => {
    router.push({
      pathname: '/screens/Quattro',
      params: { ticketNumber: ticket.number, agentId, price, age_verified: ticket.age_verified ? 'true' : 'false', isQuattroPlus: isQuattroPlus ? 'true' : 'false', detaillant, crc },
    });
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/screens/Login');
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  const handleOcrData = (data: TicketData) => {
    console.log('OCR data received:', data);
    if (data.external_ticket_number) {
      setTicket(prev => ({ ...prev, number: data.external_ticket_number || '' }));
    }
    if (data.stake) {
      setPrice(data.stake.toString());
    }
  };

  const checkTicketExists = async (ticketNumber: string) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/games/tickets/check_external_ticket/?external_ticket_number=${encodeURIComponent(ticketNumber)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTicketExists(data.exists);
      } else {
        console.error('Failed to check ticket existence');
        setTicketExists(null);
      }
    } catch (error) {
      console.error('Error checking ticket existence:', error);
      setTicketExists(null);
    } finally {
      setCheckingTicket(false);
    }
  };

  // Animations
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(24)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const ctaShine = useRef(new Animated.Value(0)).current;
  const confetti = useRef(Array.from({ length: 10 }, () => ({
    x: new Animated.Value(Math.random() * 240 - 120),
    y: new Animated.Value(0),
    o: new Animated.Value(0),
    s: 12 + Math.random() * 12,
    e: ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)],
    d: 600 + Math.random() * 600,
  }))).current;
  const giftAnimRef = useRef<Record<string, Animated.Value>>({}).current;
  const pressScaleRef = useRef<Record<string, Animated.Value>>({}).current;
  const groupAnimRef = useRef<Record<string, Animated.Value>>({}).current;
  const groupPressRef = useRef<Record<string, Animated.Value>>({}).current;
  const ticketAnim = useRef(new Animated.Value(1)).current;

  const ticketInputRef = useRef<TextInput | null>(null);
  const priceInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    // Fetch user profile to get agent information
    const fetchUserProfile = async () => {
      try {
        const profile = await AuthService.getProfile();
        setAgentId(profile.username);
        setPosName(profile.point_of_sale_name || 'Not Assigned');
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Fallback to default if profile fetch fails
        setAgentId('AGENT123');
        setPosName('Not Assigned');
      }
    };

    // Fetch gifts from backend
    const fetchGifts = async () => {
      try {
        const gifts = await GiftService.fetchGifts();
        setAvailableGifts(gifts);
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
        // Fallback to static gifts if fetch fails
        setAvailableGifts([
          { id: 1, range: 'A', name: 'Montre connecter', stock_quantity: 98, image: '/static/images/montre-image.jpg' },
          { id: 2, range: 'B', name: 'Echarpe', stock_quantity: 1605, image: '/static/images/maillot-image.jpeg' },
          { id: 3, range: 'B', name: 'Casquette', stock_quantity: 0, image: '/static/images/casquette-image.jpg' },
          { id: 4, range: 'C', name: 'Stylo', stock_quantity: 0, image: '/static/images/pencil-image.png' },
          { id: 5, range: 'C', name: 'Porte Cle', stock_quantity: 0, image: '/static/images/portecle-image.png' },
        ]);
      }
    };

    fetchUserProfile();
    fetchGifts();
  }, []);

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(cardFade, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();

    // rotate header icon (ticket)
    Animated.loop(
      Animated.timing(rotate, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // CTA shine loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaShine, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(ctaShine, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    ctaPulse.stopAnimation();
    ctaPulse.setValue(1);
    if (!nextDisabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ctaPulse, { toValue: 1.04, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(ctaPulse, { toValue: 1.0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [nextDisabled]);


  // Confetti burst when form becomes valid
  const prevValidRef = useRef(false);
  useEffect(() => {
    const now = !nextDisabled;
    if (now && !prevValidRef.current) {
      confetti.forEach(({ x, y, o, d }) => {
        x.setValue(Math.random() * 240 - 120);
        y.setValue(0);
        o.setValue(0);
        Animated.parallel([
          Animated.timing(y, { toValue: -140 - Math.random() * 60, duration: d, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(o, { toValue: 1, duration: 150, useNativeDriver: true }),
          Animated.timing(o, { toValue: 0, duration: 250, delay: d - 200, useNativeDriver: true }),
        ]).start();
      });
    }
    prevValidRef.current = now;
  }, [nextDisabled, confetti]);

  // Animate ticket input on change (digital pop)
  useEffect(() => {
    ticketAnim.stopAnimation();
    ticketAnim.setValue(0.94);
    Animated.spring(ticketAnim, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
  }, [ticket.number]);

  // Check ticket existence when ticket number is valid
  useEffect(() => {
    if (ticketValid) {
      setCheckingTicket(true);
      setTicketExists(null);
      const timeoutId = setTimeout(() => {
        checkTicketExists(ticket.number);
      }, 500); // Debounce for 500ms
      return () => clearTimeout(timeoutId);
    } else {
      setTicketExists(null);
      setCheckingTicket(false);
    }
  }, [ticket.number, ticketValid]);



  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <LinearGradient colors={['#141e30', '#243b55', '#1e3c72', '#2a5298']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 180, width: '100%' }}>
        <View pointerEvents="none" style={styles.bgDecorWrap}>
          <View style={[styles.bgBubble, { top: -40, right: -30, backgroundColor: '#DBEAFE' }]} />
          <View style={[styles.bgBubble, { bottom: -20, left: -30, backgroundColor: '#FDE68A' }]} />
        </View>

        <View style={{ alignItems: 'center',marginTop: 40, marginBottom: -10}}>  
            <Image
                source={require('../../assets/images/quatro-logo.png')}
                style={{width: 250, height: 100}}
                resizeMode="contain"
              />
        </View>

        <Animated.View style={[styles.headerBar, { opacity: fade, transform: [{ translateY: slide }] }] }>
          <View style={{ flex: 1 }}>

            <View style={{alignSelf: 'center' }}>
              {/* <Text style={styles.brand}>QUATRO Plus</Text> */}
              {/* image */}
            </View>

            {/* Agent Name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <View>

              <Text style={{ fontSize: 14, color: colors.textLight }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              <Text style={{ fontSize: 16, color: colors.textLight }}>Agent ID: <Text style={{ fontWeight: '700' }}>{agentId}</Text></Text>
              <Text style={{ fontSize: 14, color: colors.textLight }}>POS: <Text style={{ fontWeight: '700' }}>{posName}</Text></Text>
              </View>

            </View>

          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </Animated.View>


          {/* inputs */}
      <Animated.View style={[styles.card, { opacity: cardFade, transform: [{ translateY: cardSlide }] }] }>
        <View style={styles.formBlock}>
          <View style={styles.formHeaderRow}>
            <Text style={styles.label}>Numéro du ticket</Text>
          </View>
          <Animated.View style={[styles.inputRow, focused === 'ticket' ? styles.inputRowFocused : undefined, { transform: [{ scale: ticketAnim }], borderColor: ticketValid ? '#10B981' : (focused === 'ticket' ? colors.primaryBlue : '#E5E7EB') }]}>
            <Text style={styles.inputIcon}>🎫</Text>
            <TextInput
              ref={ticketInputRef}
              value={ticket.number}
              onChangeText={(text) => setTicket(prev => ({ ...prev, number: text }))}
              keyboardType="numeric"
              placeholder="Ex: 25011B2025A7000008384979"
              placeholderTextColor={colors.textLight}
              style={[styles.input, { flex: 1 }]}
              returnKeyType="next"
              onSubmitEditing={() => priceInputRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={30}
              // the minimum lenght of TRNS is 33 NUmber
              onFocus={() => setFocused('ticket')}
              onBlur={() => setFocused((f) => (f === 'ticket' ? null : f))}
            />
            <OcrButton
              onDataExtracted={handleOcrData}
              style={{ marginLeft: 10, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: colors.primaryBlue, borderRadius: 6 }}
              title="📷 Scan"
            />
          </Animated.View>
          <Animated.View style={{ opacity: ticketValid ? 1 : 0, transform: [{ translateY: ticketValid ? 0 : -6 }], marginTop: 6 }}>
            {checkingTicket ? (
              <Text style={{ color: colors.primaryBlue, fontWeight: '700' }}>🔄 Vérification en cours...</Text>
            ) : ticketExists === true ? (
              <Text style={{ color: '#EF4444', fontWeight: '700' }}>❌ Numéro de ticket déjà utilisé</Text>
            ) : ticketExists === false ? (
              <Text style={{ color: '#10B981', fontWeight: '700' }}>✅ Numéro valide</Text>
            ) : null}
          </Animated.View>
          {!ticketValid && ticket.number.length > 0 && (
            <Text style={{ color: '#EF4444', fontWeight: '700', marginTop: 6 }}>❌ Le numéro de ticket doit contenir au moins 25 caractères</Text>
          )}
          <View style={styles.divider} />
          <View style={styles.formHeaderRow}>
            <Text style={[styles.label, { marginTop: 0 }]}>Mise</Text>
            <Text style={styles.hintText}>Min 5 MAD</Text>
          </View>
          <Animated.View style={[styles.inputRow, focused === 'price' ? styles.inputRowFocused : undefined, { borderColor: priceValid ? '#10B981' : (focused === 'price' ? colors.primaryBlue : '#E5E7EB') }]}>
            <Text style={styles.inputIcon}>💵</Text>
            <TextInput
              ref={priceInputRef}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="Ex: 50"
              placeholderTextColor={colors.textLight}
              style={[styles.input, { flex: 1 }]}
              returnKeyType="done"
              onFocus={() => setFocused('price')}
              onBlur={() => setFocused((f) => (f === 'price' ? null : f))}
            />
          </Animated.View>
          </View>
          <View style={{ height: 6 }} />
          <View style={styles.validationRow}>
            <Text style={[styles.helper, { color: price.length === 0 ? colors.textLight : priceValid ? colors.green : '#EF4444' }]}>
              {price.length === 0 ? 'Entrez un prix supérieur ou égal à 5' : priceValid ? 'Prix valide' : 'Prix invalide'}
            </Text>
          </View>


          {/* Is quattro plus check box */}
          {parsedPrice >= 7.5 && (
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ width: 20, height: 20, borderWidth: 2, borderColor: colors.primaryBlue, borderRadius: 4, marginRight: 8, backgroundColor: isQuattroPlus ? colors.primaryBlue : 'transparent', alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => setIsQuattroPlus(!isQuattroPlus)}
                  >
                    {isQuattroPlus && <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={{ color: colors.textDark, fontSize: 14 }}>
                    C'est un Quatro Plus
                  </Text>
                </View>
              </View>
            )}


          {/* Terms and Conditions checkbox */}
          <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ width: 20, height: 20, borderWidth: 2, borderColor: colors.primaryBlue, borderRadius: 4, marginRight: 8, backgroundColor: ticket.age_verified ? colors.primaryBlue : 'transparent', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  setTicket(prev => ({ ...prev, age_verified: !prev.age_verified }));
                  setTermsAccepted(!ticket.age_verified);
                }}
              >
                {ticket.age_verified && <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTermsModal(true)}>
                <Text style={{ color: colors.textDark, fontSize: 14 }}>
                  J'accepte les <Text style={{ color: colors.primaryBlue, textDecorationLine: 'underline' }}>conditions générales</Text>
                </Text>
              </TouchableOpacity>


            </View>
          </View>

          {!priceValid && price.length > 0 && (
            <Text style={styles.helper}>Le prix doit être supérieur ou égal à 5.</Text>
          )}
          </Animated.View>

          {/* middle texts */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 3 }]}>Cadeaux disponibles</Text>
          {/* <Text style={[styles.helper, { marginTop: 2, marginBottom: 30 }]}>Prouve ton talent, deviens champion de Quatro Plus !</Text> */}
          <View style={styles.legalTextContainer}>
              <Text style={styles.legalText}>Photo non contractuelle</Text>
            </View>

          {/* gifts section */}
          <View style={styles.giftsSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.giftsScrollContent}
              decelerationRate="fast"
              snapToAlignment="center"
            >
              {availableGifts.map((gift, index) => {
                const giftKey = gift.id.toString();
                if (!giftAnimRef[giftKey]) giftAnimRef[giftKey] = new Animated.Value(1);
                if (!pressScaleRef[giftKey]) pressScaleRef[giftKey] = new Animated.Value(1);
                
                return (
                  <Animated.View 
                    key={gift.id} 
                    style={[
                      styles.giftCardContainer,
                      {
                        opacity: giftAnimRef[giftKey],
                        transform: [
                          { translateY: giftAnimRef[giftKey].interpolate({ inputRange: [0,1], outputRange: [12, 0] }) },
                          { scale: pressScaleRef[giftKey] },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.92}
                      accessibilityRole="button"
                      accessibilityLabel={`Cadeau ${gift.name}`}
                      onPressIn={() => {
                        Animated.timing(pressScaleRef[giftKey], { toValue: 0.96, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
                      }}
                      onPressOut={() => {
                        Animated.spring(pressScaleRef[giftKey], { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
                      }}
                    >
                      <View style={[
                        styles.giftCard,
                        gift.range === 'A' ? styles.giftCardPremium : (gift.range === 'B' ? styles.giftCardStandard : styles.giftCardBasic)
                      ]}>
                        <View style={styles.giftImageContainer}>
                          <Image 
                            source={{ 
                              uri: gift.image ? `${API_BASE_URL.replace('/api', '')}${gift.image}` : 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=800&auto=format&fit=crop' 
                            }} 
                            style={styles.giftImage}
                            resizeMode="cover"
                          />
                          {/* {gift.stock_quantity === 0 && (
                            <View style={styles.stockOverlay}>
                              <Text style={styles.stockText}>Rupture</Text>
                            </View>
                          )} */}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
            
         
          </View>


        {/* Confetti emoji burst */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 140, alignItems: 'center' }}>
          {confetti.map((c, i) => (
            <Animated.Text key={`cf-${i}`} style={{ position: 'absolute', transform: [{ translateX: c.x }, { translateY: c.y }], opacity: c.o, fontSize: c.s }}>{c.e}</Animated.Text>
          ))}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

          {/* continue button as a footer */}
      <View style={styles.footer}>
        <Animated.View style={{ opacity: nextDisabled ? 0.6 : 1, transform: [{ scale: ctaPulse }] }}>
          <View style={{ position: 'relative', marginHorizontal: 16 }}>
            <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: -6, bottom: -6, borderRadius: 18, opacity: ctaShine.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [0, 0.6, 0.6, 0] }), shadowColor: '#6EE7B7', shadowOpacity: 0.8, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } }} />
            <LinearGradient colors={["#1976D2", "#2BD2A4"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ borderRadius: 40 }}>
              <NextButton
                title={loading ? 'Chargement…' : 'Continuer ➡️'}
                onPress={nextDisabled || loading ? undefined : () => { setLoading(true); setTimeout(() => { setLoading(false); goNext(); }, 800); }}
                style={{ borderRadius: 40,}}
                color={'blue'}
              />
            </LinearGradient>

          </View>
        </Animated.View>
      </View>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <Condition
          onAccept={() => {
            setTermsAccepted(true);
            setTicket(prev => ({ ...prev, age_verified: true }));
            setShowTermsModal(false);
          }}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}