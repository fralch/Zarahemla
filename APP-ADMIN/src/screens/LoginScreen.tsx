import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';

interface LoginScreenProps {
  onLogin: () => void;
  api: any;
}

const COLORS = {
  primary: '#FF4458',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
};

export default function LoginScreen({ onLogin, api }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(email, password);
      if (result.token) {
        onLogin();
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.backgroundPattern}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.orb, { 
            width: 100 + i * 40, 
            height: 100 + i * 40, 
            left: (i % 2) * -30,
            top: i * 120,
            opacity: 0.03,
          }]} />
        ))}
      </View>
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>Z</Text>
          </View>
          <Text variant="displaySmall" style={styles.title}>Zarahemla</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Admin Console</Text>
        </View>

        <Surface style={styles.surface} elevation={0}>
          <Text variant="titleMedium" style={styles.formTitle}>Sign In</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            textColor={COLORS.text}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            textColor={COLORS.text}
          />
          
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button}
            loading={loading}
            disabled={loading}
            buttonColor={COLORS.primary}
            textColor="#FFFFFF"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </Button>
        </Surface>

        <Text variant="bodySmall" style={styles.footer}>
          Secure admin access only
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  surface: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  formTitle: {
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 4,
  },
  footer: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 24,
  },
});