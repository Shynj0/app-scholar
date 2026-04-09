import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const GradesViewScreen = ({ navigation }) => {
  const { grades } = useGrades();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.media, 0);
    return (sum / grades.length).toFixed(2);
  };

  const getStatusColor = (situacao) => {
    switch (situacao) {
      case 'Aprovado':
        return Colors.success;
      case 'Recuperação':
        return Colors.warning;
      case 'Reprovado':
        return Colors.danger;
      default:
        return Colors.textLight;
    }
  };

  const renderGradeCard = ({ item }) => (
    <View key={item.id} style={styles.gradeCardWrapper}>
      <Card style={styles.gradeCard}>
        <View style={styles.gradeHeader}>
          <Text style={styles.disciplineName}>{item.disciplina}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.situacao) }]}>
            <Text style={styles.statusText}>{item.situacao}</Text>
          </View>
        </View>

        <View style={styles.gradesGrid}>
          <View style={styles.gradeCell}>
            <Text style={styles.gradeCellLabel}>Nota 1</Text>
            <Text style={styles.gradeCellValue}>{item.nota1}</Text>
          </View>
          <View style={styles.gradeCell}>
            <Text style={styles.gradeCellLabel}>Nota 2</Text>
            <Text style={styles.gradeCellValue}>{item.nota2}</Text>
          </View>
          <View style={[styles.gradeCell, styles.mediaBold]}>
            <Text style={styles.gradeCellLabel}>Média</Text>
            <Text style={[styles.gradeCellValue, styles.mediaValue]}>{item.media}</Text>
          </View>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Consulta de Boletim" 
        onLogout={handleLogout}
        showLogout={true}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.gpaSection}>
          <Card style={styles.gpaCard}>
            <Text style={styles.gpaLabel}>Média Geral (GPA)</Text>
            <Text style={styles.gpaValue}>{calculateGPA()}</Text>
            <Text style={styles.gpaInfo}>
              {grades.filter(g => g.situacao === 'Aprovado').length} / {grades.length} disciplinas aprovadas
            </Text>
          </Card>
        </View>

        <View style={styles.statsSection}>
          <Card style={styles.statCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Aprovadas</Text>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {grades.filter(g => g.situacao === 'Aprovado').length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Recuperação</Text>
              <Text style={[styles.statValue, { color: Colors.warning }]}>
                {grades.filter(g => g.situacao === 'Recuperação').length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reprovadas</Text>
              <Text style={[styles.statValue, { color: Colors.danger }]}>
                {grades.filter(g => g.situacao === 'Reprovado').length}
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.disciplinesSection}>
          <Text style={styles.sectionTitle}>Disciplinas</Text>
          {grades.length > 0 ? (
            <FlatList
              data={grades}
              renderItem={renderGradeCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.md,
  },
  gpaSection: {
    marginBottom: Spacing.lg,
  },
  gpaCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  gpaLabel: {
    fontSize: FontSizes.base,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  gpaValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  gpaInfo: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
  statsSection: {
    marginBottom: Spacing.lg,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  disciplinesSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  gradeCardWrapper: {
    marginBottom: Spacing.md,
  },
  gradeCard: {
    paddingVertical: Spacing.lg,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  disciplineName: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.small,
  },
  statusText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  gradesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.medium,
    backgroundColor: Colors.background,
  },
  mediaBold: {
    backgroundColor: Colors.primaryLight,
  },
  gradeCellLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  gradeCellValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  mediaValue: {
    color: Colors.white,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

export default GradesViewScreen;