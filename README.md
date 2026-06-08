# 🎓 App Scholar

**Aplicativo Mobile de Gerenciamento de Boletim Acadêmico**  
Fatec Jacareí · Desenvolvimento de Software Multiplataforma  
Disciplina: Programação para Dispositivos Móveis I  
Professor: André Olímpio

---

## 📁 Estrutura do Projeto

```
app-scholar/
├── backend/              ← API REST (Node.js + Express + PostgreSQL)
│   ├── controllers/      ← Lógica de negócio
│   ├── routes/           ← Definição dos endpoints
│   ├── database/         ← Schema SQL e scripts de setup
│   ├── middleware/        ← JWT auth
│   ├── server.js         ← Entrada do servidor
│   └── .env.example      ← Variáveis de ambiente
└── mobile/               ← App React Native (TypeScript + Expo)
    ├── src/
    │   ├── screens/      ← Telas do app
    │   ├── components/   ← Componentes reutilizáveis
    │   ├── services/     ← API, ViaCEP, IBGE
    │   ├── context/      ← AuthContext (JWT + AsyncStorage)
    │   ├── navigation/   ← Stack + Bottom Tab Navigator
    │   ├── hooks/        ← Custom hooks (useIBGE)
    │   └── styles/       ← Tema / Design System
    └── App.tsx           ← Componente raiz
```

---

## 🚀 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Expo CLI: `npm install -g expo-cli`
- Expo Go (celular) **ou** emulador Android/iOS

---

## ⚙️ 1. Backend — Configuração

### 1.1 Instalar dependências

```bash
cd backend
npm install
```

### 1.2 Criar banco de dados no PostgreSQL

```sql
CREATE DATABASE app_scholar;
```

### 1.3 Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=app_scholar
JWT_SECRET=app_scholar_jwt_secret_super_seguro_2024
JWT_EXPIRES_IN=7d
```

### 1.4 Executar o setup do banco (schema + dados iniciais)

```bash
npm run setup
```

Isso criará todas as tabelas e inserirá dados de exemplo.

**Credenciais padrão criadas:**
| Campo  | Valor                    |
|--------|--------------------------|
| E-mail | admin@appscholar.com     |
| Senha  | admin123                 |

### 1.5 Iniciar o servidor

```bash
# Produção
npm start

# Desenvolvimento (com hot-reload)
npm run dev
```

O servidor estará em: **http://localhost:3000**

---

## 📱 2. App Mobile — Configuração

### 2.1 Instalar dependências

```bash
cd mobile
npm install
```

### 2.2 Configurar a URL da API

Edite o arquivo `src/services/api.ts` e ajuste a `BASE_URL`:

```typescript
// Emulador Android
const BASE_URL = 'http://10.0.2.2:3000';

// Emulador iOS / Web
const BASE_URL = 'http://localhost:3000';

// Dispositivo físico → use o IP da sua máquina:
const BASE_URL = 'http://192.168.1.xxx:3000';
```

> 💡 Para descobrir seu IP: `ipconfig` (Windows) ou `ifconfig` / `ip a` (Linux/Mac)

### 2.3 Iniciar o app

```bash
npx expo start
```

- Escaneie o QR com o app **Expo Go** (Android/iOS)
- Pressione `a` para emulador Android
- Pressione `i` para simulador iOS
- Pressione `w` para rodar no navegador (React Native Web)

---

## 🌐 APIs implementadas

### APIs do Backend

| Método | Endpoint                    | Descrição              | Auth |
|--------|-----------------------------|------------------------|------|
| POST   | `/api/login`                | Autenticação JWT       | ❌   |
| GET    | `/api/alunos`               | Listar alunos          | ✅   |
| POST   | `/api/alunos`               | Cadastrar aluno        | ✅   |
| PUT    | `/api/alunos/:id`           | Atualizar aluno        | ✅   |
| DELETE | `/api/alunos/:id`           | Remover aluno          | ✅   |
| GET    | `/api/professores`          | Listar professores     | ✅   |
| POST   | `/api/professores`          | Cadastrar professor    | ✅   |
| GET    | `/api/disciplinas`          | Listar disciplinas     | ✅   |
| POST   | `/api/disciplinas`          | Cadastrar disciplina   | ✅   |
| GET    | `/api/notas`                | Listar notas           | ✅   |
| POST   | `/api/notas`                | Lançar notas           | ✅   |
| PUT    | `/api/notas/:id`            | Atualizar notas        | ✅   |
| GET    | `/api/boletim/:matricula`   | Consultar boletim      | ✅   |

### APIs Externas

| API               | Uso                                           |
|-------------------|-----------------------------------------------|
| **ViaCEP**        | Preenchimento automático de endereço por CEP  |
| **IBGE Localidades** | Lista de estados para seleção no cadastro  |

---

## 📱 Telas do App

| Tela                      | Descrição                                    |
|---------------------------|----------------------------------------------|
| **Login**                 | Autenticação com JWT, validação de campos    |
| **Dashboard**             | Painel principal com cards de navegação      |
| **Cadastro de Alunos**    | Formulário completo com auto-fill por CEP    |
| **Cadastro de Professores** | Formulário com chips de titulação          |
| **Cadastro de Disciplinas** | Formulário com seleção de professor        |
| **Lançamento de Notas**   | Busca de aluno, seleção de disciplina, notas |
| **Boletim**               | Relatório de notas com filtro por semestre   |

---

## 🧰 Tecnologias

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** (pg)
- **JWT** (jsonwebtoken)
- **Bcrypt** (bcryptjs)
- **CORS**, **dotenv**

### Frontend
- **React Native** + **Expo**
- **TypeScript**
- **React Navigation** (Stack + Bottom Tabs)
- **Axios** (HTTP requests)
- **AsyncStorage** (persistência do token)
- **@expo/vector-icons** (Ionicons)

### APIs Externas
- **ViaCEP**: https://viacep.com.br/ws/{cep}/json/
- **IBGE Localidades**: https://servicodados.ibge.gov.br/api/v1/localidades/estados

---

## 🗃️ Banco de Dados

```sql
usuarios      → autenticação (email, senha hash, perfil)
alunos        → dados do aluno + endereço
professores   → dados do professor
disciplinas   → nome, carga horária, professor, curso, semestre
notas         → nota1, nota2, média (auto), situação (auto)
```

A **média** e a **situação** são calculadas automaticamente:
- `média = (nota1 + nota2) / 2`
- `situação = média >= 5 ? 'Aprovado' : 'Reprovado'`

---

## 🔑 Hooks React utilizados

| Hook        | Uso                                               |
|-------------|---------------------------------------------------|
| `useState`  | Formulários, loading, modais, dados da tela       |
| `useEffect` | Carregamento de dados, inicialização, IBGE        |
| `useContext`| Autenticação global (AuthContext)                 |

---

## 📋 Exemplo de resposta — Boletim

```json
{
  "success": true,
  "data": {
    "aluno": {
      "nome": "Maria Souza",
      "matricula": "2024001",
      "curso": "DSM",
      "email": "maria.souza@email.com"
    },
    "disciplinas": [
      {
        "disciplina": "Programação para Dispositivos Móveis I",
        "nota1": 8.5,
        "nota2": 7.0,
        "media": 7.75,
        "situacao": "Aprovado"
      }
    ],
    "resumo": {
      "total": 3,
      "aprovados": 2,
      "reprovados": 1,
      "cursando": 0,
      "media_geral": "6.92"
    }
  }
}
```

---

> Projeto desenvolvido para a disciplina **Programação para Dispositivos Móveis I**  
> Fatec Jacareí · Curso de Desenvolvimento de Software Multiplataforma  
> Professor: André Olímpio
