import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/theme';

// Importações (Mantendo as que você já tinha)
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CadastroAlunosScreen from '../screens/CadastroAlunosScreen';
import CadastroProfessoresScreen from '../screens/CadastroProfessoresScreen';
import CadastroDisciplinasScreen from '../screens/CadastroDisciplinasScreen';
import BoletimScreen from '../screens/BoletimScreen';
import NotasScreen from '../screens/NotasScreen';

import ProfessorDashboardScreen from '../screens/ProfessorDashboardScreen';
import ProfessorDisciplinasScreen from '../screens/ProfessorDisciplinasScreen';
import ProfessorAlunosScreen from '../screens/ProfessorAlunosScreen';

import AlunoDashboardScreen from '../screens/AlunoDashboardScreen';
import AlunoDisciplinasScreen from '../screens/AlunoDisciplinasScreen'; // Nova Importação
import AlunosBoletimScreen from '../screens/AlunoBoletimScreen';     // Nova Importação

import { AdmStackParamList, ProfStackParamList, AlunoStackParamList, AuthStackParamList } from './types';

const AdmStack = createStackNavigator<AdmStackParamList>();
const ProfStack = createStackNavigator<ProfStackParamList>();
const AlunoStack = createStackNavigator<AlunoStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

function AdmNavigator() {
  return (
    <AdmStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <AdmStack.Screen name="AdmDashboard" component={DashboardScreen} />
      <AdmStack.Screen name="CadastroAlunos" component={CadastroAlunosScreen} />
      <AdmStack.Screen name="CadastroProfessores" component={CadastroProfessoresScreen} />
      <AdmStack.Screen name="CadastroDisciplinas" component={CadastroDisciplinasScreen} />
      <AdmStack.Screen name="Notas" component={NotasScreen} />
      <AdmStack.Screen name="Boletim" component={BoletimScreen} />
    </AdmStack.Navigator>
  );
}

function ProfessorNavigator() {
  return (
    <ProfStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <ProfStack.Screen name="ProfessorDashboard" component={ProfessorDashboardScreen} />
      <ProfStack.Screen name="ProfDisciplinas" component={ProfessorDisciplinasScreen} />
      <ProfStack.Screen name="ProfAlunos" component={ProfessorAlunosScreen} />
      <ProfStack.Screen name="ProfNotas" component={NotasScreen} />
    </ProfStack.Navigator>
  );
}

function AlunoNavigator() {
  return (
    <AlunoStack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      <AlunoStack.Screen name="AlunoDashboard" component={AlunoDashboardScreen} />
      {/* Registrando as novas telas abaixo */}
      <AlunoStack.Screen name="AlunoDisciplinas" component={AlunoDisciplinasScreen} />
      <AlunoStack.Screen name="AlunoBoletim" component={AlunosBoletimScreen} />
    </AlunoStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, usuario } = useAuth();
  
  if (isLoading) return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderNav = () => {
    const perfil = usuario?.perfil?.toLowerCase().trim();
    if (perfil === 'adm' || perfil === 'admin') return <AdmNavigator />;
    if (perfil === 'professor') return <ProfessorNavigator />;
    return <AlunoNavigator />;
  };

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      ) : renderNav()}
    </NavigationContainer>
  );
}