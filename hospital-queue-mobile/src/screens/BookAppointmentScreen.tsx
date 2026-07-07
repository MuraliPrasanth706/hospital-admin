import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, QueueEntry } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius, fieldHeight } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { Button } from '../components/ui/Button';
import { useAppointmentStore } from '../store/appointmentStore';
import { apiService } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BookAppointment'>;
  route: RouteProp<RootStackParamList, 'BookAppointment'>;
};

export const BookAppointmentScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { doctorId, doctorName, specialty, queueCount, estimatedWait } =
    route.params;

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queueList, setQueueList] = useState<QueueEntry[]>([]);

  const setAppointment = useAppointmentStore((s) => s.setAppointment);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await apiService.getDoctorLiveQueue(doctorId);
        const mapped = data.map((apt: any, i: number) => ({
          position: i + 1,
          maskedName: apt.patient_name,
          token: apt.token.substring(0, 8).toUpperCase(),
        }));
        setQueueList(mapped);
      } catch (err) {
        console.error('Failed to fetch doctor queue', err);
      }
    };
    fetchQueue();
  }, [doctorId]);

  const canBook = patientName.trim().length >= 2;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Hide picker on Android immediately after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBook = async () => {
    setLoading(true);
    try {
      // Format the date for PostgreSQL (YYYY-MM-DD)
      const formattedForDB = date.toISOString().split('T')[0];
      const appointment = await apiService.bookAppointment(doctorId, formattedForDB, patientName.trim());
      
      const appt = {
        token: appointment.token,
        patientName: patientName.trim(),
        doctorId,
        doctorName,
        specialty,
        date: formattedDate,
        position: queueCount + 1,
        status: 'waiting' as const,
      };
      setAppointment(appt);

      Alert.alert(
        'Appointment Confirmed!',
        `Your consultation with ${doctorName} is booked.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset stack to Home (HospitalList)
              navigation.reset({
                index: 0,
                routes: [{ name: 'HospitalList' }],
              });
            },
          },
        ]
      );
    } catch (err: any) {
      console.error('Failed to book appointment', err);
      Alert.alert('Booking Failed', err.response?.data?.message || 'Something went wrong while booking.');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>
      <View style={styles.divider} />

      {/* Doctor hero card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>CONSULTATION WITH</Text>
        <Text style={styles.heroName}>{doctorName}</Text>
        <Text style={styles.heroSpecialty}>{specialty}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{queueCount}</Text>
            <Text style={styles.statLabel}>IN QUEUE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>~{estimatedWait} min</Text>
            <Text style={styles.statLabel}>EST. WAIT</Text>
          </View>
        </View>
      </View>

      {/* Queue List */}
      {queueList.length > 0 && (
        <View style={styles.queueCard}>
          <Text style={styles.fieldLabel}>CURRENTLY WAITING ({queueList.length})</Text>
          <View style={styles.queueList}>
            {queueList.slice(0, 5).map((entry) => (
              <View key={entry.token} style={styles.queueItem}>
                <View style={styles.queuePos}>
                  <Text style={styles.queuePosText}>{entry.position}</Text>
                </View>
                <Text style={styles.queueName}>{entry.maskedName}</Text>
              </View>
            ))}
            {queueList.length > 5 && (
              <Text style={styles.moreText}>+ {queueList.length - 5} more waiting...</Text>
            )}
          </View>
        </View>
      )}

      {/* Form */}
      <View style={styles.formCard}>
        {/* Patient name */}
        <Text style={styles.fieldLabel}>PATIENT NAME</Text>
        <TextInput
          style={styles.input}
          value={patientName}
          onChangeText={setPatientName}
          placeholder="Enter full name"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
          returnKeyType="done"
        />

        {/* Date */}
        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>
          APPOINTMENT DATE
        </Text>
        <TouchableOpacity 
          style={styles.dateRow}
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{formattedDate}</Text>
          <View style={styles.calIcon}>
            <Text style={styles.calIconText}>📅</Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            accentColor={colors.blue}
          />
        )}
        {Platform.OS === 'ios' && showDatePicker && (
          <TouchableOpacity 
            style={styles.doneBtn} 
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        )}

        {/* Conditions */}
        <View style={styles.conditions}>
          {[
            'Free cancellation up to 1 h before',
            'Tracking token issued on confirm',
            'Live updates in app',
          ].map((c, i) => (
            <View key={i} style={styles.conditionRow}>
              <View style={styles.dot} />
              <Text style={styles.conditionText}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <Button
          label="Book Appointment"
          onPress={handleBook}
          disabled={!canBook}
          loading={loading}
        />
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
    marginBottom: spacing.xl,
  },
  heroLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  heroName: {
    ...typography.sectionTitle,
    color: colors.white,
    marginBottom: 2,
  },
  heroSpecialty: {
    ...typography.bodyLarge,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.80)',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 28,
  },
  statLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textTransform: 'uppercase',
  },

  // Queue List
  queueCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  queueList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 4,
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
  moreText: {
    ...typography.bodySmall,
    color: colors.pencil,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  // Form
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.pencil,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  input: {
    height: fieldHeight,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  dateRow: {
    height: fieldHeight,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.paper,
  },
  dateText: {
    ...typography.mono,
    fontSize: 15,
    color: colors.ink,
    letterSpacing: 1,
  },
  calIcon: {
    padding: 4,
  },
  calIconText: {
    fontSize: 18,
  },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  doneBtnText: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: 16,
  },
  conditions: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.blue,
    flexShrink: 0,
  },
  conditionText: {
    ...typography.body,
    color: colors.pencil,
  },

  // CTA
  ctaWrap: {
    marginBottom: spacing.md,
  },
});
