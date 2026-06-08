import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { colors, fontSize, radius, shadow, spacing } from '../styles/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

interface Props {
  title:       string;
  onPress:     () => void;
  variant?:    Variant;
  loading?:    boolean;
  disabled?:   boolean;
  style?:      ViewStyle;
  textStyle?:  TextStyle;
  fullWidth?:  boolean;
}

const VARIANT: Record<Variant, { btn: ViewStyle; text: TextStyle }> = {
  primary:   { btn: { backgroundColor: colors.primary },   text: { color: '#fff' } },
  secondary: { btn: { backgroundColor: colors.secondary },  text: { color: '#fff' } },
  danger:    { btn: { backgroundColor: colors.danger },     text: { color: '#fff' } },
  outline:   { btn: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary }, text: { color: colors.primary } },
  ghost:     { btn: { backgroundColor: 'transparent' },     text: { color: colors.primary } },
};

export default function CustomButton({
  title, onPress, variant = 'primary', loading = false,
  disabled = false, style, textStyle, fullWidth = false,
}: Props) {
  const vs    = VARIANT[variant];
  const isDark = variant === 'primary' || variant === 'secondary' || variant === 'danger';

  return (
    <TouchableOpacity
      style={[styles.base, vs.btn, fullWidth && styles.full, (disabled || loading) && styles.dim, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading
        ? <ActivityIndicator color={isDark ? '#fff' : colors.primary} size="small" />
        : <Text style={[styles.text, vs.text, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base:  { borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center', minHeight: 50, ...shadow.sm },
  full:  { width: '100%' },
  text:  { fontSize: fontSize.base, fontWeight: '700', letterSpacing: 0.3 },
  dim:   { opacity: 0.6 },
});
