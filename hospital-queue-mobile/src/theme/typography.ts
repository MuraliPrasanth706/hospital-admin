import { Platform } from 'react-native';

const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

export const typography = {
  heroTitle: {
    fontFamily: serif,
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  pageTitle: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  sectionTitle: {
    fontFamily: serif,
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    lineHeight: 16,
  },
  mono: {
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
    fontSize: 14,
    lineHeight: 20,
  },
  token: {
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
