import React from 'react';
import { NavigationContainer }       from '@react-navigation/native';
import { createStackNavigator }      from '@react-navigation/stack';
import { createBottomTabNavigator }  from '@react-navigation/bottom-tabs';
import { Ionicons }                  from '@expo/vector-icons';
import { ActivityIndicator, View }   from 'react-native';

import { useAuth }             from '../context/AuthContext';
import { colors }              from '../styles/theme';

import LoginScreen             from '../screens/LoginScreen';
import DashboardScreen         from '../screens/DashboardScreen';
import BoletimScreen           from '../screens/BoletimScreen';
import CadastroAlunosScreen    from '../screens/CadastroAlunosScreen';
import CadastroProfessoresScreen from '../screens/CadastroProfessoresScreen';
import CadastroDisciplinasScreen from '../screens/CadastroDisciplinasScreen';
import NotasScreen             from '../screens/NotasScreen';

import {
  AppStackParamList,
  TabParamList,
  AuthStackParamList,
} from './types';

const AuthStack = createStackNavigator<AuthStackParamList>();
const AppStack  = createStackNavigator<AppStackParamList>();
const Tab       = createBottomTabNavigator<TabParamList>();

// ─── Bottom Tabs ──────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor:  colors.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Dashboard: ['home',         'home-outline'],
            Boletim:   ['document-text','document-text-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['apps', 'apps-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
        tabBarLabel: route.name === 'Dashboard' ? 'Início' : 'Boletim',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Boletim"   component={BoletimScreen} />
    </Tab.Navigator>
  );
}

// ─── App Stack (autenticado) ──────────────────────────────────────────────────
function AppNavigatorStack() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AppStack.Screen name="MainTabs"            component={MainTabs} />
      <AppStack.Screen name="CadastroAlunos"      component={CadastroAlunosScreen} />
      <AppStack.Screen name="CadastroProfessores" component={CadastroProfessoresScreen} />
      <AppStack.Screen name="CadastroDisciplinas" component={CadastroDisciplinasScreen} />
      <AppStack.Screen name="Notas"               component={NotasScreen} />
    </AppStack.Navigator>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigatorStack />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
