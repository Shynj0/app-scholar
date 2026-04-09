import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const Header = ({ title, onLogout, showLogout = true }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>App Scholar</Text>
      </View>
      {showLogout && (
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={onLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomLeftRadius: BorderRadius.large,
    borderBottomRightRadius: BorderRadius.large,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: '#E0E7FF',
    marginTop: Spacing.xs,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  logoutText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});

export default Header;