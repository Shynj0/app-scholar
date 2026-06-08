import React, { ReactNode } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Platform, ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons }       from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../styles/theme';

interface Props {
  title:       string;
  subtitle?:   string;
  showBack?:   boolean;
  right?:      ReactNode;
  style?:      ViewStyle;
}

export default function ScreenHeader({ title, subtitle, showBack = true, right, style }: Props) {
  const navigation = useNavigation();
  const TOP = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;

  return (
    <View style={[styles.container, { paddingTop: TOP }, style]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        <View style={styles.rightArea}>{right ?? <View style={{ width: 40 }} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingBottom:   spacing.lg,
    paddingHorizontal: spacing.md,
  },
  row:       { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  backBtn:   { width: 40, height: 40, justifyContent: 'center' },
  titleArea: { flex: 1, alignItems: 'center' },
  title:     { fontSize: fontSize.xl, fontWeight: '700', color: '#fff' },
  subtitle:  { fontSize: fontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  rightArea: { width: 40, alignItems: 'flex-end' },
});
