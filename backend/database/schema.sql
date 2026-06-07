
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,-- Tabela de notas
CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 DECIMAL(4,2),
  nota2 DECIMAL(4,2),
  media DECIMAL(4,2),
  situacao VARCHAR(20) CHECK (situacao IN ('Aprovado', 'Reprovado', 'Recuperação', 'Cursando')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(aluno_id, disciplina_id)
);
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('aluno', 'professor', 'admin')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  curso VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  cep VARCHAR(10),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de professores
CREATE TABLE IF NOT EXISTS professores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  titulacao VARCHAR(100) NOT NULL,
  area VARCHAR(255) NOT NULL,
  tempo_docencia INTEGER NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de disciplinas
CREATE TABLE IF NOT EXISTS disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  carga_horaria INTEGER NOT NULL,
  professor_id INTEGER REFERENCES professores(id) ON DELETE SET NULL,
  curso VARCHAR(255) NOT NULL,
  semestre INTEGER NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
  nota1 DECIMAL(4,2),
  nota2 DECIMAL(4,2),
  media DECIMAL(4,2),
  situacao VARCHAR(20) CHECK (situacao IN ('Aprovado', 'Reprovado', 'Recuperação', 'Cursando')),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(aluno_id, disciplina_id)
);

-- Inserir usuário admin padrão (senha: admin123)
-- A senha em hash bcrypt de 'admin123'
INSERT INTO usuarios (email, senha_hash, perfil)
VALUES ('admin@scholar.com', '$2b$10$rOzJqxqQX1e5v3K8J0Y0K.3YgJ7R1dF7r1UPPfX8K2Y0VJ1I6x7Ky', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir professor de exemplo
INSERT INTO usuarios (email, senha_hash, perfil)
VALUES ('professor@scholar.com', '$2b$10$rOzJqxqQX1e5v3K8J0Y0K.3YgJ7R1dF7r1UPPfX8K2Y0VJ1I6x7Ky', 'professor')
ON CONFLICT (email) DO NOTHING;

INSERT INTO professores (nome, titulacao, area, tempo_docencia, email, usuario_id)
VALUES (
  'Dr. Carlos Ferreira',
  'Doutorado',
  'Engenharia de Software',
  10,
  'professor@scholar.com',
  (SELECT id FROM usuarios WHERE email = 'professor@scholar.com')
)
ON CONFLICT (email) DO NOTHING;

-- Inserir aluno de exemplo
INSERT INTO usuarios (email, senha_hash, perfil)
VALUES ('aluno@scholar.com', '$2b$10$rOzJqxqQX1e5v3K8J0Y0K.3YgJ7R1dF7r1UPPfX8K2Y0VJ1I6x7Ky', 'aluno')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alunos (nome, matricula, curso, email, telefone, cep, endereco, cidade, estado, usuario_id)
VALUES (
  'João Silva',
  'DSM2024001',
  'Desenvolvimento de Software Multiplataforma',
  'aluno@scholar.com',
  '(12) 99999-0000',
  '12245000',
  'Rua Exemplo, 123',
  'Jacareí',
  'SP',
  (SELECT id FROM usuarios WHERE email = 'aluno@scholar.com')
)
ON CONFLICT (email) DO NOTHING;

-- Disciplinas de exemplo
INSERT INTO disciplinas (nome, carga_horaria, professor_id, curso, semestre)
VALUES
  ('Programação Mobile', 80, (SELECT id FROM professores LIMIT 1), 'Desenvolvimento de Software Multiplataforma', 3),
  ('Banco de Dados', 60, (SELECT id FROM professores LIMIT 1), 'Desenvolvimento de Software Multiplataforma', 2),
  ('Engenharia de Software', 60, (SELECT id FROM professores LIMIT 1), 'Desenvolvimento de Software Multiplataforma', 3)
ON CONFLICT DO NOTHING;

-- Notas de exemplo para o aluno
INSERT INTO notas (aluno_id, disciplina_id, nota1, nota2, media, situacao)
SELECT
  (SELECT id FROM alunos LIMIT 1),
  d.id,
  CASE d.nome
    WHEN 'Programação Mobile' THEN 8.0
    WHEN 'Banco de Dados' THEN 7.5
    WHEN 'Engenharia de Software' THEN 6.0
  END,
  CASE d.nome
    WHEN 'Programação Mobile' THEN 7.0
    WHEN 'Banco de Dados' THEN 8.0
    WHEN 'Engenharia de Software' THEN 5.5
  END,
  CASE d.nome
    WHEN 'Programação Mobile' THEN 7.5
    WHEN 'Banco de Dados' THEN 7.75
    WHEN 'Engenharia de Software' THEN 5.75
  END,
  CASE d.nome
    WHEN 'Programação Mobile' THEN 'Aprovado'
    WHEN 'Banco de Dados' THEN 'Aprovado'
    WHEN 'Engenharia de Software' THEN 'Reprovado'
  END
FROM disciplinas d
ON CONFLICT (aluno_id, disciplina_id) DO NOTHING;

COMMENT ON TABLE alunos IS 'Tabela de alunos matriculados';
COMMENT ON TABLE professores IS 'Tabela de professores cadastrados';
COMMENT ON TABLE disciplinas IS 'Tabela de disciplinas oferecidas';
COMMENT ON TABLE notas IS 'Tabela de notas por aluno e disciplina';
