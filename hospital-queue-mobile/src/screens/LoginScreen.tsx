import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius, fieldHeight } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const setStoredPhone = useAuthStore((s) => s.setPhone);

  const isValid = /^[6-9][0-9]{9}$/.test(phone.replace(/\s/g, ''));

  const handleSend = () => {
    const clean = phone.replace(/\s/g, '');
    setStoredPhone(clean);
    navigation.navigate('OTP', { phone: clean });
  };

  const formatDisplay = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + ' ' + digits.slice(5);
  };

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Sign in</Text>
          <Text style={styles.headerSubtitle}>Patient access</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.phoneIconWrap}>
          <Text style={styles.phoneIcon}>📱</Text>
        </View>
        <Text style={styles.heroTitle}>Welcome to QueueCare</Text>
        <Text style={styles.heroSubtitle}>
          Sign in with your mobile to book{'\n'}and track your queue.
        </Text>
      </View>

      {/* Phone input section */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
        <View style={styles.phoneRow}>
          {/* Country chip */}
          <View style={styles.countryChip}>
            <Text style={styles.countryCode}>+91</Text>
            <Text style={styles.chipCaret}>▾</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            value={formatDisplay(phone)}
            onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            inputMode="numeric"
            placeholder="98765 43210"
            placeholderTextColor={colors.placeholder}
            maxLength={11}
            returnKeyType="done"
          />
        </View>
        <Text style={styles.helperText}>
          We'll text a 6-digit verification code.{'\n'}Standard rates may apply.
        </Text>
      </View>

      <View style={styles.ctaWrap}>
        <Button
          label="Send verification code  →"
          onPress={handleSend}
          disabled={!isValid}
        />
      </View>

      {/* Trust strip */}
      <View style={styles.trustCard}>
        <View style={styles.trustRow}>
          <Text style={styles.trustCheck}>✓</Text>
          <View style={styles.trustText}>
            <Text style={styles.trustTitle}>Your number stays private</Text>
            <Text style={styles.trustBody}>
              Used only for booking confirmations and queue alerts.
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.terms}>
        By continuing you agree to our{' '}
        <Text style={styles.termsLink}>Terms &amp; Privacy</Text>.
      </Text>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
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

  // Hero card
  heroCard: {
    backgroundColor: colors.blue,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  phoneIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  phoneIcon: {
    fontSize: 26,
  },
  heroTitle: {
    ...typography.sectionTitle,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Input card
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputLabel: {
    ...typography.label,
    color: colors.pencil,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sand,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    height: fieldHeight,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryCode: {
    ...typography.mono,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  chipCaret: {
    fontSize: 11,
    color: colors.pencil,
    marginTop: 2,
  },
  phoneInput: {
    flex: 1,
    height: fieldHeight,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 17,
    fontWeight: '500',
    color: colors.ink,
    letterSpacing: 1.5,
    backgroundColor: colors.white,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.pencil,
    lineHeight: 18,
  },

  // CTA
  ctaWrap: {
    marginBottom: spacing.lg,
  },

  // Trust strip
  trustCard: {
    backgroundColor: colors.greenLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    marginBottom: spacing.xl,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  trustCheck: {
    fontSize: 16,
    color: colors.green,
    fontWeight: '700',
    marginTop: 1,
  },
  trustText: {
    flex: 1,
  },
  trustTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.green,
    marginBottom: 2,
  },
  trustBody: {
    ...typography.bodySmall,
    color: colors.green,
    lineHeight: 18,
  },

  // Terms
  terms: {
    ...typography.bodySmall,
    color: colors.pencil,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  termsLink: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },
});
