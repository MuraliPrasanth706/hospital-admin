import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { Button } from '../components/ui/Button';
import { OTPInput } from '../components/ui/OTPInput';
import { useAuthStore } from '../store/authStore';
import { apiService, setAuthToken } from '../services/api';

const DEMO_OTP = '123456';
const RESEND_SECONDS = 30;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'OTP'>;
  route: RouteProp<RootStackParamList, 'OTP'>;
};

export const OTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    setOtp('');
    setCountdown(RESEND_SECONDS);
  };

  const handleVerify = useCallback(async () => {
    setLoading(true);

    if (otp === DEMO_OTP) {
      try {
        // Try to login directly
        let authData;
        try {
          authData = await apiService.loginPatient(phone);
        } catch (err: any) {
          // If user not found, register them then login
          if (err.response?.status === 404 || err.response?.data?.message?.includes('not found')) {
            await apiService.registerPatient(phone);
            authData = await apiService.loginPatient(phone);
          } else {
            throw err;
          }
        }

        const { token } = authData;
        setToken(token);
        setAuthToken(token);
        setAuthenticated(true);
        navigation.navigate('HospitalList');
      } catch (err) {
        console.error('Auth failed', err);
        Alert.alert('Error', 'Failed to authenticate with backend.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Invalid OTP', 'Please enter the correct code. Demo: 123456');
      setOtp('');
    }
  }, [otp, phone, navigation, setAuthenticated, setToken]);

  const maskedPhone = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Verify</Text>
          <Text style={styles.headerSubtitle}>Step 2 of 2</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Verification card */}
      <View style={styles.card}>
        <View style={styles.shieldWrap}>
          <Text style={styles.shieldIcon}>🛡</Text>
        </View>

        <Text style={styles.cardTitle}>Enter verification code</Text>
        <Text style={styles.sentText}>We sent a 6-digit code to</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.phoneBold}>{maskedPhone}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.changeLink}>[edit] change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.otpWrap}>
          <OTPInput value={otp} onChange={setOtp} length={6} />
        </View>

        {/* Demo strip */}
        <View style={styles.demoStrip}>
          <Text style={styles.demoText}>
            Demo OTP: <Text style={styles.demoBold}>{DEMO_OTP}</Text>
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        <Button
          label="Verify & continue"
          onPress={handleVerify}
          disabled={otp.length < 6}
          loading={loading}
        />
      </View>

      {/* Resend */}
      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't get it? </Text>
        {countdown > 0 ? (
          <Text style={styles.resendCountdown}>Resend in {countdown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Resend code</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backArrow: {
    fontSize: 32,
    color: colors.ink,
    fontWeight: '300',
    lineHeight: 36,
    marginTop: -4,
  },
  headerTitle: {
    ...typography.pageTitle,
    color: colors.ink,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.pencil,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.xl,
  },

  // Verification card
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  shieldWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shieldIcon: {
    fontSize: 26,
  },
  cardTitle: {
    ...typography.sectionTitle,
    color: colors.ink,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sentText: {
    ...typography.body,
    color: colors.pencil,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  phoneBold: {
    ...typography.body,
    fontWeight: '700',
    color: colors.ink,
  },
  changeLink: {
    ...typography.body,
    color: colors.blue,
    textDecorationLine: 'underline',
  },

  // OTP
  otpWrap: {
    marginBottom: spacing.lg,
    width: '100%',
  },

  // Demo strip
  demoStrip: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.blueBorder,
    backgroundColor: colors.blueLight,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  demoText: {
    ...typography.body,
    color: colors.blue,
  },
  demoBold: {
    fontWeight: '700',
    letterSpacing: 3,
  },

  // CTA
  ctaWrap: {
    marginBottom: spacing.lg,
  },

  // Resend
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    ...typography.body,
    color: colors.pencil,
  },
  resendCountdown: {
    ...typography.body,
    fontWeight: '700',
    color: colors.ink,
  },
  resendLink: {
    ...typography.body,
    color: colors.blue,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
