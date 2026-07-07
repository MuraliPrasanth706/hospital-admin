import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Hospital } from '../types';
import { colors } from '../theme/colors';
import { spacing, radius, fieldHeight, avatarSmall } from '../theme/spacing';
import { typography } from '../theme/typography';
import { SafeScreen } from '../components/layout/SafeScreen';
import { StatusPill } from '../components/ui/StatusPill';
import { apiService } from '../services/api';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HospitalList'>;
};

const HospitalCard: React.FC<{
  item: Hospital;
  index: number;
  onPress: () => void;
}> = ({ item, index, onPress }) => {
  const initial = item.name[0].toUpperCase();

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
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardAddress}>📍 {item.address}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaStar}>★</Text>
            <Text style={styles.metaText}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{item.distance} away</Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.cardRight}>
          <StatusPill isOpen={item.isOpen} />
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HospitalListScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await apiService.getClinics();
        setHospitals(data);
      } catch (error) {
        console.error('Failed to fetch hospitals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q),
    );
  }, [query, hospitals]);

  return (
    <SafeScreen scrollable={false} padHorizontal={false}>
      <View style={styles.headerWrap}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Select Hospital</Text>
            <Text style={styles.headerSubtitle}>Find a clinic near you</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search hospitals or area"
              placeholderTextColor={colors.placeholder}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <HospitalCard
            item={item}
            index={index}
            onPress={() =>
              navigation.navigate('DoctorList', {
                clinicId: item.id,
                clinicName: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.blue} style={{ marginTop: 40 }} />
          ) : (
            <Text style={styles.emptyText}>No clinics match your search.</Text>
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

  // List
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    paddingTop: spacing.sm,
  },
  separator: {
    height: 14,
  },

  // Card shadow wrapper (needed so shadow renders outside borderRadius)
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

  // Card
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
  avatar: {
    width: avatarSmall,
    height: avatarSmall,
    borderRadius: radius.sm,
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.blue,
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    ...typography.cardTitle,
    color: colors.ink,
  },
  cardAddress: {
    ...typography.bodySmall,
    color: colors.pencil,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaStar: {
    fontSize: 12,
    color: '#F59E0B',
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.pencil,
  },
  metaDot: {
    ...typography.bodySmall,
    color: colors.pencilLight,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
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
