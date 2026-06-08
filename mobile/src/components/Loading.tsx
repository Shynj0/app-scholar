import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { colors, fontSize } from '../styles/theme';

interface Props { visible: boolean; message?: string }

export default function Loading({ visible, message = 'Aguarde...' }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.msg}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  box:     { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', minWidth: 180, gap: 16 },
  msg:     { fontSize: fontSize.md, color: colors.text.secondary, marginTop: 8 },
});
