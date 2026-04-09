import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTANTE: Adicione estes imports para o Navigator conhecer as telas
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StudentRegistrationScreen from '../screens/StudentRegistrationScreen';
import TeacherRegistrationScreen from '../screens/TeacherRegistrationScreen';
import SubjectRegistrationScreen from '../screens/SubjectRegistrationScreen';
import GradesViewScreen from '../screens/GradesViewScreen';

// Import do seu contexto de autenticação
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Fluxo de Autenticação
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Fluxo do Aplicativo (Logado)
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="StudentRegistration" component={StudentRegistrationScreen} />
            <Stack.Screen name="TeacherRegistration" component={TeacherRegistrationScreen} />
            <Stack.Screen name="SubjectRegistration" component={SubjectRegistrationScreen} />
            <Stack.Screen name="GradesView" component={GradesViewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;  