import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Doctor } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius, fieldHeight, avatarSize } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { Avatar } from '../components/ui/Avatar';
import { apiService } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorList'>;
  route: RouteProp<RootStackParamList, 'DoctorList'>;
};

const DoctorCard: React.FC<{
  item: Doctor;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  // Entrance animation: fade + slide up
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  // Press scale animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 80,
        useNativeDriver: true,
        tension: 60,
        friction: 9,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardShadowWrap,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Avatar name={item.name} size={avatarSize} fontSize={15} />
        <View style={styles.cardInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaStar}>★</Text>
            <Text style={styles.metaVal}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.metaDivider}>|</Text>
            <Text style={styles.metaIcon}>⏱</Text>
            <Text style={styles.metaVal}>~{item.avgConsultMinutes} min</Text>
            <Text style={styles.metaDivider}>|</Text>
            <Text style={styles.metaVal}>{item.experienceYears} yrs</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.queueBadge, item.queueCount > 0 ? styles.queueBadgeActive : styles.queueBadgeEmpty]}>
            <Text style={styles.queueIcon}>👥</Text>
            <Text style={[styles.queueText, item.queueCount > 0 ? styles.queueTextActive : styles.queueTextEmpty]}>
              {item.queueCount === 0 ? 'No wait' : `${item.queueCount} waiting`}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DoctorListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { clinicId, clinicName } = route.params;
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiService.getDoctorsByClinic(clinicId);
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, [clinicId]);

  const clinicDoctors = useMemo(() => {
    let filtered = doctors;
    const q = query.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [doctors, query]);

  return (
    <SafeScreen scrollable={false} padHorizontal={false}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{clinicName}</Text>
            <Text style={styles.headerSubtitle}>Choose a specialist</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors or specialty"
              placeholderTextColor={colors.placeholder}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
      </View>

      <FlatList
        data={clinicDoctors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <DoctorCard
            item={item}
            index={index}
            onPress={() =>
              navigation.navigate('BookAppointment', {
                doctorId: item.id,
                doctorName: item.name,
                specialty: item.specialty,
                queueCount: item.queueCount,
                estimatedWait: item.estimatedWaitMinutes,
              })
            }
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.blue} style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.emptyText}>No specialists match your search.</Text>
          )
        }
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    marginBottom: spacing.lg,
  },
  searchWrap: {
    marginBottom: spacing.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: fieldHeight,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    height: fieldHeight,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    paddingTop: spacing.sm,
  },
  separator: {
    height: 14,
  },

  // Card shadow wrapper
  cardShadowWrap: {
    borderRadius: radius.lg,
    // iOS shadow
    shadowColor: '#1B4D8F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    // Android shadow
    elevation: 6,
    backgroundColor: colors.white,
  },

  // Doctor card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    gap: spacing.md,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  doctorName: {
    ...typography.cardTitle,
    color: colors.ink,
  },
  specialty: {
    ...typography.body,
    fontStyle: 'italic',
    color: colors.blue,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  metaStar: {
    fontSize: 12,
    color: '#F59E0B',
  },
  metaIcon: {
    fontSize: 12,
    color: colors.pencil,
  },
  metaVal: {
    ...typography.bodySmall,
    color: colors.pencil,
  },
  metaDivider: {
    ...typography.bodySmall,
    color: colors.border,
    marginHorizontal: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  queueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  queueBadgeActive: {
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: colors.amberBorder,
  },
  queueBadgeEmpty: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  queueIcon: {
    fontSize: 12,
  },
  queueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  queueTextActive: {
    color: colors.amber,
  },
  queueTextEmpty: {
    color: colors.green,
  },
  chevron: {
    fontSize: 22,
    color: colors.blue,
    fontWeight: '300',
  },
  emptyText: {
    ...typography.body,
    color: colors.pencil,
    textAlign: 'center',
    marginTop: 40,
  },
});
