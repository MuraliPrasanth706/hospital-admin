import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface StatusPillProps {
  isOpen: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ isOpen }) => (
  <View style={[styles.pill, isOpen ? styles.open : styles.closed]}>
    <Text style={[styles.text, isOpen ? styles.textOpen : styles.textClosed]}>
      {isOpen ? 'OPEN' : 'CLOSED'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  open: {
    backgroundColor: colors.greenLight,
    borderColor: colors.greenBorder,
  },
  closed: {
    backgroundColor: colors.sand,
    borderColor: colors.border,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  textOpen: {
    color: colors.green,
  },
  textClosed: {
    color: colors.pencil,
  },
});
