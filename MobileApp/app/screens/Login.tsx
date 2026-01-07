import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NextButton from '../components/NextButton';
import { styles } from './Login.styles';
import { AuthService } from '../services/AuthService';
import { router } from 'expo-router';
import FirebaseService from '../services/FirebaseService';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Track screen view
    FirebaseService.trackScreenView('Login');
  }, []);

  const handleContinue = async () => {
    const user = username.trim();
    const pwd = password.trim();
    if (!user) {
      setError("Please enter your username.");
      return;
    }
    if (!pwd) {
      setError('Please enter your password.');
      return;
    }
    if (pwd.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await AuthService.login(user, pwd);
      if (result.success) {
        // Navigate to InfoScreen after successful login
        router.push('/screens/InfoScreen');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: '#F3F4F6' }}>
        <View style={{ marginTop: 60, alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/quatro-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Login</Text>
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              returnKeyType="done"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {error && (
            <Text style={{ color: '#DC2626', marginTop: 10, fontWeight: '600' }}>{error}</Text>
          )}

          <View style={{ marginTop: 20 }}>
            <NextButton title={loading ? "Logging in..." : "LogIn"} onPress={handleContinue} color="green" disabled={loading} />
          </View>
        </View>
        <Image
            source={require('../../assets/images/LN-logo.png')}
            style={styles.logo2}
            resizeMode="contain"
          />
      </View>
    </View>
  );
}