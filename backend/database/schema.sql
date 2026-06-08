-- =============================================================
--  App Scholar — Schema do Banco de Dados
--  Curso: DSM | Fatec Jacareí
-- =============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ─── DROP ───────────────────────────────────────────────────
DROP TABLE IF EXISTS notas        CASCADE;
DROP TABLE IF EXISTS disciplinas  CASCADE;
DROP TABLE IF EXISTS alunos       CASCADE;
DROP TABLE IF EXISTS professores  CASCADE;
DROP TABLE IF EXISTS usuarios     CASCADE;

-- ─── TABELA: usuarios ───────────────────────────────────────
CREATE TABLE usuarios (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  senha      VARCHAR(255) NOT NULL,
  perfil     VARCHAR(20)  NOT NULL DEFAULT 'admin'
               CHECK (perfil IN ('admin','aluno','professor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABELA: alunos ─────────────────────────────────────────
CREATE TABLE alunos (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(255) NOT NULL,
  matricula  VARCHAR(50)  UNIQUE NOT NULL,
  curso      VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  telefone   VARCHAR(20),
  cep        VARCHAR(10),
  endereco   VARCHAR(255),
  cidade     VARCHAR(100),
  estado     VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABELA: professores ────────────────────────────────────
CREATE TABLE professores (
  id              SERIAL PRIMARY KEY,
  nome            VARCHAR(255) NOT NULL,
  titulacao       VARCHAR(100),
  area            VARCHAR(100),
  tempo_docencia  INTEGER CHECK (tempo_docencia >= 0),
  email           VARCHAR(255) UNIQUE NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABELA: disciplinas ────────────────────────────────────
CREATE TABLE disciplinas (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(255) NOT NULL,
  carga_horaria INTEGER NOT NULL CHECK (carga_horaria > 0),
  professor_id  INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  curso         VARCHAR(100) NOT NULL,
  semestre      INTEGER NOT NULL CHECK (semestre BETWEEN 1 AND 10),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABELA: notas ──────────────────────────────────────────
CREATE TABLE notas (
  id            SERIAL PRIMARY KEY,
  aluno_id      INTEGER NOT NULL REFERENCES alunos(id)      ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1         NUMERIC(4,2) CHECK (nota1 BETWEEN 0 AND 10),
  nota2         NUMERIC(4,2) CHECK (nota2 BETWEEN 0 AND 10),
  media         NUMERIC(4,2),
  situacao      VARCHAR(20) DEFAULT 'Cursando',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (aluno_id, disciplina_id)
);

-- ─── ÍNDICES ────────────────────────────────────────────────
CREATE INDEX idx_alunos_matricula      ON alunos(matricula);
CREATE INDEX idx_disciplinas_professor ON disciplinas(professor_id);
CREATE INDEX idx_notas_aluno           ON notas(aluno_id);
CREATE INDEX idx_notas_disciplina      ON notas(disciplina_id);

-- ─── TRIGGER: updated_at automático ────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_upd    BEFORE UPDATE ON usuarios    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_alunos_upd      BEFORE UPDATE ON alunos      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_professores_upd BEFORE UPDATE ON professores FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_disciplinas_upd BEFORE UPDATE ON disciplinas FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_notas_upd       BEFORE UPDATE ON notas       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
