import { StackNavigationProp } from '@react-navigation/stack';

// ─── Fluxo do Administrador (Acesso Total) ────────────────────────────────────
export type AdmStackParamList = {
  AdmDashboard:        undefined;
  CadastroAlunos:      undefined;
  CadastroProfessores: undefined;
  CadastroDisciplinas: undefined;
  Notas:               undefined;
  Boletim:             undefined;
};

// ─── Fluxo do Professor ──────────────────────────────────────────────────────
export type ProfStackParamList = {
  ProfessorDashboard: undefined;
  ProfDisciplinas:    undefined;
  ProfAlunos:         undefined;
  ProfNotas:          undefined;
};

// ─── Fluxo do Aluno ──────────────────────────────────────────────────────────
export type AlunoStackParamList = {
  AlunoDashboard:   undefined;
  AlunoDisciplinas: undefined;
  AlunoBoletim:     undefined;
};

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
};

// ─── Helpers de Navegação para os Componentes ──────────────────────────────────
export type AdmStackNav   = StackNavigationProp<AdmStackParamList>;
export type ProfStackNav  = StackNavigationProp<ProfStackParamList>;
export type AlunoStackNav = StackNavigationProp<AlunoStackParamList>;
export type AuthStackNav  = StackNavigationProp<AuthStackParamList>;