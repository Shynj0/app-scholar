import { StackNavigationProp }  from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// ─── Stack (telas dentro do app autenticado) ──────────────────────────────────
export type AppStackParamList = {
  MainTabs:              undefined;
  CadastroAlunos:        undefined;
  CadastroProfessores:   undefined;
  CadastroDisciplinas:   undefined;
  Notas:                 undefined;
};

// ─── Bottom Tabs ──────────────────────────────────────────────────────────────
export type TabParamList = {
  Dashboard: undefined;
  Boletim:   undefined;
};

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
};

// ─── Helpers de navegação ─────────────────────────────────────────────────────
export type AppStackNav  = StackNavigationProp<AppStackParamList>;
export type TabNav       = BottomTabNavigationProp<TabParamList>;
export type AuthStackNav = StackNavigationProp<AuthStackParamList>;
