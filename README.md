# App Scholar - Aplicativo Mobile de Gerenciamento de Boletim Acadêmico

## Descrição

App Scholar é um aplicativo mobile multiplataforma desenvolvido em React Native para gerenciamento de informações acadêmicas de instituições de ensino superior tecnológico. O sistema permite autenticação de usuários, cadastro de informações acadêmicas (alunos, professores e disciplinas) e consulta de boletins.

## Características Principais

- **Autenticação de Usuários**: Tela de login com validação de campos
- **Cadastro de Alunos**: Gerenciar informações completas de alunos (nome, matrícula, email, endereço, etc)
- **Cadastro de Professores**: Registrar dados de professores (titulação, área de atuação, email)
- **Cadastro de Disciplinas**: Criar e gerenciar disciplinas com informações de carga horária e professor responsável
- **Consulta de Boletim**: Visualizar notas, médias e situação acadêmica
- **Interface Responsiva**: Design limpo e organizado com navegação intuitiva

## Tecnologias Utilizadas

- **React Native 0.73.2** - Framework para desenvolvimento multiplataforma
- **Expo** - Plataforma para desenvolvimento de apps em React Native
- **React Navigation 6.1.9** - Sistema de navegação entre telas
- **TypeScript** (opcional) - Tipagem estática opcional
- **React Hooks** - useState, useEffect e useContext para gerenciamento de estado

## Estrutura do Projeto

```
app-scholar/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   └── Header.js
│   ├── screens/             # Telas da aplicação
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── StudentRegistrationScreen.js
│   │   ├── TeacherRegistrationScreen.js
│   │   ├── SubjectRegistrationScreen.js
│   │   └── GradesViewScreen.js
│   ├── contexts/            # Context API para estado global
│   │   └── AuthContext.js
│   ├── hooks/               # Hooks customizados
│   │   ├── useStudents.js
│   │   ├── useTeachers.js
│   │   ├── useSubjects.js
│   │   └── useGrades.js
│   ├── styles/              # Estilos globais
│   │   └── globalStyles.js
│   └── navigation/          # Sistema de navegação
│       └── Navigation.js
├── App.js                   # Arquivo principal
├── app.json                 # Configuração do Expo
├── package.json             # Dependências do projeto
└── README.md               # Este arquivo
```

## Instalação

### Pré-requisitos

- Node.js 14+ instalado
- npm ou yarn instalado
- Expo CLI instalado (`npm install -g expo-cli`)

### Passos de Instalação

1. **Clone ou extraia o projeto:**
```bash
cd app-scholar
```

2. **Instale as dependências:**
```bash
npm install
```

ou com yarn:
```bash
yarn install
```

3. **Inicie o servidor Expo:**
```bash
npm start
```

ou com yarn:
```bash
yarn start
```

4. **Execute no emulador ou dispositivo:**

Para Android:
```bash
npm run android
```

Para iOS:
```bash
npm run ios
```

Para Web:
```bash
npm run web
```

## Como Usar

### Login

1. Na tela inicial, insira um email e qualquer senha
2. Clique em "Entrar"
3. Você será redirecionado para o Dashboard

### Cadastro de Alunos

1. No Dashboard, clique em "Cadastro de Alunos"
2. Clique em "+ Novo Aluno"
3. Preencha todos os campos obrigatórios
4. Clique em "Salvar"

### Cadastro de Professores

1. No Dashboard, clique em "Cadastro de Professores"
2. Clique em "+ Novo Professor"
3. Preencha os campos: Nome, Titulação, Área de Atuação, Tempo de Docência e Email
4. Clique em "Salvar"

### Cadastro de Disciplinas

1. No Dashboard, clique em "Cadastro de Disciplinas"
2. Clique em "+ Nova Disciplina"
3. Preencha os campos: Nome da Disciplina, Carga Horária, Professor Responsável, Curso e Semestre
4. Clique em "Salvar"

### Visualização de Boletim

1. No Dashboard, clique em "Consulta de Boletim"
2. Visualize a Média Geral (GPA)
3. Veja o resumo de disciplinas aprovadas, em recuperação e reprovadas
4. Consulte as notas detalhadas de cada disciplina

## Dados de Demonstração

O aplicativo vem com dados pré-carregados para demonstração:

**Alunos:**
- João Silva (ENG001)
- Maria Santos (ENG002)

**Professores:**
- Dr. Carlos Ferreira (Doutorado em Engenharia de Software)
- Dra. Ana Paula (Mestrado em Banco de Dados)

**Disciplinas:**
- Programação I (60 horas, 1º Semestre)
- Banco de Dados (60 horas, 2º Semestre)
- Engenharia de Software (80 horas, 3º Semestre)

**Notas:**
- Programação I: Nota 1: 8.5, Nota 2: 9.0 (Aprovado)
- Banco de Dados: Nota 1: 7.5, Nota 2: 8.0 (Aprovado)
- Engenharia de Software: Nota 1: 6.0, Nota 2: 5.5 (Reprovado)

## Conceitos Implementados

### UI/UX Mobile
✅ Layout limpo e organizado
✅ Navegação intuitiva
✅ Boa legibilidade
✅ Feedback visual para ações
✅ Validação de campos de formulário
✅ Uso adequado de cores e espaçamentos
✅ Componentes reutilizáveis
✅ Padronização de botões e inputs

### Hooks do React
✅ **useState** - Gerenciamento de estados de formulários, dados temporários e controle de telas
✅ **useEffect** - Inicialização de telas e carregamento de dados simulados
✅ **useContext** - Gerenciamento de estado de autenticação e informações do usuário

### Telas Desenvolvidas
✅ Tela de Login
✅ Tela Inicial (Dashboard)
✅ Tela de Cadastro de Alunos
✅ Tela de Cadastro de Professores
✅ Tela de Cadastro de Disciplinas
✅ Tela de Visualização de Boletim

## Validações Implementadas

- Email válido (deve conter @)
- Campos obrigatórios
- Mensagens de erro contextualizadas
- Feedback visual de erros em campos

## Cores Utilizadas

- **Primário**: #1E40AF (Azul)
- **Sucesso**: #10B981 (Verde)
- **Perigo**: #EF4444 (Vermelho)
- **Aviso**: #F59E0B (Amarelo)
- **Neutro**: Tons de cinza

## Proximos Passos (Parte 2)

A Parte 2 do projeto deverá incluir:
- Integração com API REST (Node.js)
- Conexão com banco de dados PostgreSQL
- Armazenamento persistente de dados
- Autenticação real com tokens JWT
- Sincronização com servidor

## Troubleshooting

### Erro: "Module not found"
```bash
npm install
```

### Erro ao iniciar no iOS
```bash
rm -rf node_modules Podfile.lock
npm install
cd ios && pod install && cd ..
npm run ios
```

### Erro ao iniciar no Android
```bash
npm run android
```

Se persistir, limpe o cache:
```bash
npm start -- -c
```

## Autores

Desenvolvido para a disciplina de Programação para Dispositivos Móveis I
Professor: André Olímpio
Instituição: FATEC Jacareí

## Licença

Este projeto é fornecido como atividade avaliativa da disciplina e pode ser usado para fins educacionais.

## Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências foram instaladas corretamente
2. Limpe o cache do Expo: `npm start -- -c`
3. Reinicie o servidor de desenvolvimento
4. Consulte a documentação oficial de React Native: https://reactnative.dev
5. Consulte a documentação do Expo: https://docs.expo.dev
