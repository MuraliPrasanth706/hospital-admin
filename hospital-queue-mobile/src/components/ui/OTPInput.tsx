import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/spacing';

interface OTPInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  autoFocus = true,
}) => {
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputs.current[0]?.focus(), 300);
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only accept digit
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const chars = value.split('');
    chars[index] = digit;
    const next = chars.join('').slice(0, length);
    onChange(next);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Clear previous and move focus back
        const chars = value.split('');
        chars[index - 1] = '';
        onChange(chars.join(''));
        inputs.current[index - 1]?.focus();
      } else if (value[index]) {
        const chars = value.split('');
        chars[index] = '';
        onChange(chars.join(''));
      }
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            inputs.current[i] = ref;
          }}
          style={[
            styles.box,
            value[i] ? styles.boxFilled : null,
            i === value.length && styles.boxActive,
          ]}
          value={value[i] || ''}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          caretHidden
          textAlign="center"
          cursorColor={colors.blue}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  box: {
    width: 46,
    height: 54,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: colors.blue,
    backgroundColor: colors.blueLight,
  },
  boxActive: {
    borderColor: colors.blue,
    borderWidth: 2,
  },
});
