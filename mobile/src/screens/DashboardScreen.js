import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '../styles/globalStyles';

const DashboardScreen = ({ navigation }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuItems = [
    {
      id: 1,
      title: 'Cadastro de Alunos',
      description: 'Gerenciar dados dos alunos',
      color: Colors.primary,
      screen: 'StudentRegistration',
      icon: '👨‍🎓',
    },
    {
      id: 2,
      title: 'Cadastro de Professores',
      description: 'Gerenciar dados dos professores',
      color: Colors.primaryLight,
      screen: 'TeacherRegistration',
      icon: '👨‍🏫',
    },
    {
      id: 3,
      title: 'Cadastro de Disciplinas',
      description: 'Gerenciar disciplinas e cursos',
      color: Colors.success,
      screen: 'SubjectRegistration',
      icon: '📚',
    },
    {
      id: 4,
      title: 'Consulta de Boletim',
      description: 'Visualizar notas e desempenho',
      color: Colors.warning,
      screen: 'GradesView',
      icon: '📊',
    },
  ];

  return (
    <View style={styles.container}>
      <Header 
        title="Dashboard" 
        onLogout={handleLogout}
        showLogout={true}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.userGreeting}>
          <Text style={styles.greetingText}>
            Bem-vindo ao App Scholar!
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'Usuário'}
          </Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCardWrapper}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.85}
            >
              <Card style={[styles.menuCard, { borderTopColor: item.color, borderTopWidth: 4 }]}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
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
  userGreeting: {
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
  menuGrid: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuCardWrapper: {
    marginBottom: Spacing.md,
  },
  menuCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  menuTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default DashboardScreen;