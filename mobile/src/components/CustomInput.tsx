import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, TextInputProps, ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../styles/theme';

interface Props extends TextInputProps {
  label?:          string;
  error?:          string;
  icon?:           keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  rightIcon?:      React.ReactNode;
}

export default function CustomInput({
  label, error, icon, containerStyle, rightIcon,
  secureTextEntry, ...rest
}: Props) {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrap, !!error && styles.inputError]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={error ? colors.danger : colors.gray[500]}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.text.placeholder}
          secureTextEntry={secureTextEntry && !showPass}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPass(p => !p)}
            style={styles.eyeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.gray[500]}
            />
          </TouchableOpacity>
        )}

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { marginBottom: spacing.md },
  label:       { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary, marginBottom: 6, letterSpacing: 0.3 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputError:  { borderColor: colors.danger },
  icon:        { marginRight: spacing.sm },
  input:       { flex: 1, fontSize: fontSize.base, color: colors.text.primary, paddingVertical: 12 },
  eyeBtn:      { padding: 4, marginLeft: spacing.xs },
  rightIcon:   { marginLeft: spacing.sm },
  errorText:   { fontSize: fontSize.xs, color: colors.danger, marginTop: 4, marginLeft: 2 },
});