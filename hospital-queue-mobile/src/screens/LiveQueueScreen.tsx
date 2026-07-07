import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { upNextQueue } from '../data/mock';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { Button } from '../components/ui/Button';
import { useAppointmentStore } from '../store/appointmentStore';
import { apiService } from '../services/api';
import { QueueEntry } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LiveQueue'>;
  route: RouteProp<RootStackParamList, 'LiveQueue'>;
};

const POLL_INTERVAL_MS = 10000; // 10 s

export const LiveQueueScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token, patientName, doctorId, doctorName, specialty, initialPosition } =
    route.params;

  const [position, setPosition] = useState(initialPosition);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [upNextList, setUpNextList] = useState<QueueEntry[]>([]);
  const cancelAppointment = useAppointmentStore((s) => s.cancel);

  const spinAnim = useRef(new Animated.Value(0)).current;

  // ETA = position * avg consult (12 min)
  const avgMinutes = 12;
  const estimatedWait = position * avgMinutes;

  const fetchQueue = async () => {
    try {
      const data = await apiService.getDoctorLiveQueue(doctorId);
      // Map data to upNextList
      const mapped = data.map((apt: any, i: number) => ({
        position: i + 1,
        maskedName: apt.patient_name, // Real name from backend
        token: apt.token.substring(0, 8).toUpperCase(),
      }));
      setUpNextList(mapped);

      // Also update current user's position if they are in the queue
      const myIdx = mapped.findIndex((apt: any) => apt.token === token.substring(0, 8).toUpperCase() || apt.token === token);
      if (myIdx !== -1) {
        setPosition(myIdx); // Position is 0-indexed (0 = in progress)
      } else {
        // Not in queue anymore? Maybe completed.
      }
    } catch (err) {
      console.error('Failed to fetch queue', err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => {
      fetchQueue();
      setLastRefreshed(new Date());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [doctorId]);

  const handleRefresh = () => {
    Animated.sequence([
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(spinAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
    fetchQueue();
    setLastRefreshed(new Date());
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel your appointment?',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: () => {
            cancelAppointment();
            navigation.popToTop();
          },
        },
      ],
    );
  };

  const progressPct = Math.max(
    0,
    Math.min(1, (initialPosition - position) / Math.max(initialPosition, 1)),
  );

  const statusLabel =
    position === 0 ? 'IN PROGRESS' : 'WAITING';
  const statusColor =
    position === 0 ? colors.green : colors.amberBorder;

  return (
    <SafeScreen>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Live Queue</Text>
          <Text style={styles.headerSubtitle}>Token {token}</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
          <Animated.Text
            style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
          >
            ↻
          </Animated.Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {/* Status hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroSectionLabel}>YOUR STATUS</Text>
          <View style={[styles.statusPill, { borderColor: statusColor }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusColor }]}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Main numbers */}
        <View style={styles.numbersRow}>
          <View style={styles.numberBlock}>
            <Text style={styles.bigNumber}>
              {position === 0 ? '0' : String(position)}
            </Text>
            <Text style={styles.numberLabel}>
              {position === 1
                ? 'person ahead'
                : position === 0
                ? 'Your turn!'
                : 'people ahead of you'}
            </Text>
          </View>
          <View style={styles.numberBlock}>
            <Text style={styles.bigNumber}>{estimatedWait}</Text>
            <Text style={styles.numberLabel}>MIN · EST. WAIT</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPct * 100}%` }]}
          />
        </View>

        <Text style={styles.heroDoctor}>
          with {doctorName} · {specialty}
        </Text>
      </View>

      {/* Notification card */}
      <View style={styles.notifCard}>
        <View style={styles.notifRow}>
          <View style={styles.amberDot} />
          <View style={styles.notifText}>
            <Text style={styles.notifTitle}>Stay nearby</Text>
            <Text style={styles.notifBody}>
              We'll notify you when your turn approaches.
            </Text>
            <Text style={styles.notifSub}>
              Avg. consultation: {avgMinutes} min.
            </Text>
          </View>
        </View>
      </View>

      {/* Up Next */}
      <View style={styles.upNextCard}>
        <View style={styles.upNextHeader}>
          <Text style={styles.upNextTitle}>UP NEXT</Text>
          <Text style={styles.upNextCount}>{upNextList.length} PATIENTS</Text>
        </View>
        <View style={styles.upNextDivider} />
        {upNextList.map((entry) => (
          <View key={entry.token} style={styles.queueRow}>
            <View style={styles.queuePos}>
              <Text style={styles.queuePosText}>{entry.position}</Text>
            </View>
            <Text style={styles.queueName}>{entry.maskedName}</Text>
            <Text style={styles.queueToken}>{entry.token}</Text>
          </View>
        ))}
      </View>

      {/* Cancel */}
      <Button
        label="Cancel Appointment"
        onPress={handleCancel}
        variant="outline"
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.pageTitle,
    color: colors.ink,
  },
  headerSubtitle: {
    ...typography.token,
    color: colors.pencil,
    marginTop: 3,
    letterSpacing: 0.6,
  },
  refreshBtn: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 24,
    color: colors.blue,
    fontWeight: '400',
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
    marginBottom: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  heroSectionLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  numbersRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.lg,
  },
  numberBlock: {
    flex: 1,
  },
  bigNumber: {
    fontSize: 52,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 58,
  },
  numberLabel: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.full,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderRadius: radius.full,
  },
  heroDoctor: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
  },

  // Notification card
  notifCard: {
    backgroundColor: colors.amberLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.amberBorder,
    marginBottom: spacing.lg,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  amberDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.amber,
    marginTop: 5,
    flexShrink: 0,
  },
  notifText: {
    flex: 1,
    gap: 2,
  },
  notifTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.amber,
  },
  notifBody: {
    ...typography.body,
    color: '#92400E',
  },
  notifSub: {
    ...typography.bodySmall,
    color: '#92400E',
    marginTop: 2,
  },

  // Up next
  upNextCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  upNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  upNextTitle: {
    ...typography.label,
    color: colors.ink,
    textTransform: 'uppercase',
  },
  upNextCount: {
    ...typography.label,
    color: colors.pencil,
    textTransform: 'uppercase',
  },
  upNextDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.sm,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  queuePos: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queuePosText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
  },
  queueName: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
    fontFamily: 'monospace',
  },
  queueToken: {
    ...typography.token,
    color: colors.pencil,
    letterSpacing: 0.4,
  },
});
