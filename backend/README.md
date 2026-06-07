# App Scholar — Backend (Parte 2)

Backend em **Node.js + Express + PostgreSQL** para o App Scholar.

---

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+ rodando localmente
- npm

---

## Instalação

```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 4. Crie o banco de dados no PostgreSQL
psql -U postgres -c "CREATE DATABASE app_scholar;"

# 5. Execute o script de criação das tabelas
psql -U postgres -d app_scholar -f database/schema.sql

# 6. Inicie o servidor
npm run dev       # com hot-reload (nodemon)
# ou
npm start         # produção
```

O servidor sobe em: `http://localhost:3000`

---

## Variáveis de Ambiente (.env)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_scholar
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=appscholar_secret_2024_troque_em_producao
```

---

## Usuários de demonstração

Criados pelo `schema.sql` (senha: **admin123**):

| Email | Perfil |
|---|---|
| admin@scholar.com | admin |
| professor@scholar.com | professor |
| aluno@scholar.com | aluno |

---

## Endpoints da API

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | /api/login | Login, retorna JWT | ❌ |
| POST | /api/registro | Cria novo usuário | ❌ |

**Exemplo de login:**
```json
POST /api/login
{ "email": "aluno@scholar.com", "senha": "admin123" }

Resposta:
{
  "token": "eyJ...",
  "usuario": { "id": 3, "nome": "João Silva", "email": "aluno@scholar.com", "perfil": "aluno" }
}
```

---

### Alunos

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /api/alunos | Lista todos | ✅ |
| GET | /api/alunos/:id | Busca por ID | ✅ |
| GET | /api/alunos/matricula/:mat | Busca por matrícula | ✅ |
| GET | /api/alunos/cep/:cep | Proxy ViaCEP | ❌ |
| POST | /api/alunos | Cadastra aluno | ✅ |
| PUT | /api/alunos/:id | Atualiza aluno | ✅ |
| DELETE | /api/alunos/:id | Remove aluno | ✅ |

---

### Professores

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /api/professores | Lista todos | ✅ |
| GET | /api/professores/:id | Busca por ID | ✅ |
| POST | /api/professores | Cadastra professor | ✅ |
| PUT | /api/professores/:id | Atualiza | ✅ |
| DELETE | /api/professores/:id | Remove | ✅ |

---

### Disciplinas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /api/disciplinas | Lista todas | ✅ |
| GET | /api/disciplinas/:id | Busca por ID | ✅ |
| POST | /api/disciplinas | Cadastra disciplina | ✅ |
| PUT | /api/disciplinas/:id | Atualiza | ✅ |
| DELETE | /api/disciplinas/:id | Remove | ✅ |

---

### Notas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /api/notas | Lista todas | ✅ |
| GET | /api/notas/aluno/:id | Notas de um aluno | ✅ |
| POST | /api/notas | Lança nota | ✅ |
| PUT | /api/notas/:id | Atualiza nota | ✅ |

> Média e situação são calculadas automaticamente ao salvar.

---

### Boletim

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | /api/boletim/:matricula | Boletim completo do aluno | ✅ |

**Exemplo de resposta:**
```json
{
  "aluno": "João Silva",
  "matricula": "DSM2024001",
  "curso": "Desenvolvimento de Software Multiplataforma",
  "mediaGeral": 6.98,
  "resumo": { "aprovadas": 2, "reprovadas": 1, "recuperacao": 0, "cursando": 0 },
  "disciplinas": [
    {
      "disciplina": "Programação Mobile",
      "nota1": 8,
      "nota2": 7,
      "media": 7.5,
      "situacao": "Aprovado",
      "semestre": 3,
      "professor": "Dr. Carlos Ferreira"
    }
  ]
}
```

---

## APIs Externas Integradas

| API | URL | Uso |
|---|---|---|
| ViaCEP | `https://viacep.com.br/ws/{cep}/json/` | Preenchimento automático de endereço |
| IBGE Localidades | `https://servicodados.ibge.gov.br/api/v1/localidades/estados` | Lista de estados e cidades |

---

## Estrutura de Pastas

```
backend/
├── controllers/
│   ├── authController.js
│   ├── alunosController.js
│   ├── professoresController.js
│   ├── disciplinasController.js
│   ├── notasController.js
│   └── boletimController.js
├── routes/
│   ├── auth.js
│   ├── alunos.js
│   ├── professores.js
│   ├── disciplinas.js
│   ├── notas.js
│   └── boletim.js
├── middleware/
│   └── auth.js          # Verificação JWT
├── database/
│   ├── connection.js    # Pool PostgreSQL
│   └── schema.sql       # DDL + dados de exemplo
├── .env.example
├── package.json
└── server.js
```

---

## Configuração no App Mobile

Edite `src/services/api.js` e ajuste a `BASE_URL`:

```js
// Emulador Android:
const BASE_URL = 'http://10.0.2.2:3000/api';

// Expo Go na mesma rede Wi-Fi:
const BASE_URL = 'http://192.168.X.X:3000/api';  // seu IP local

// Emulador iOS:
const BASE_URL = 'http://localhost:3000/api';
```
