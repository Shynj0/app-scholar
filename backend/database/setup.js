/**
 * App Scholar — Setup do Banco de Dados
 * Executa o schema e insere dados iniciais (seed).
 * Uso: npm run setup
 */
const pool    = require('./connection');
const bcrypt  = require('bcryptjs');
const fs      = require('fs');
const path    = require('path');

async function main() {
  try {
    console.log('\n🎓 App Scholar — Setup do Banco de Dados\n');

    // 1. Executar schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Schema criado com sucesso');

    // 2. Usuário administrador
    const senhaAdmin = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO usuarios (nome, email, senha, perfil)
       VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      ['Administrador', 'admin@appscholar.com', senhaAdmin, 'admin']
    );
    console.log('✅ Admin criado  →  admin@appscholar.com  /  admin123');

    // 3. Professores de exemplo
    const professores = [
      ['Prof. André Olímpio',   'Mestre',   'Desenvolvimento de Software', 10, 'andre@fatec.sp.gov.br'],
      ['Prof. João Silva',      'Doutor',   'Banco de Dados',               8,  'joao@fatec.sp.gov.br'],
      ['Profa. Maria Oliveira', 'Doutora',  'Programação Mobile',           5,  'maria.o@fatec.sp.gov.br'],
    ];
    for (const p of professores) {
      await pool.query(
        `INSERT INTO professores (nome,titulacao,area,tempo_docencia,email)
         VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING`,
        p
      );
    }
    console.log('✅ Professores de exemplo inseridos');

    // 4. Disciplinas de exemplo
    const { rows: profs } = await pool.query('SELECT id FROM professores LIMIT 3');
    if (profs.length >= 3) {
      const disciplinas = [
        ['Programação para Dispositivos Móveis I', 80, profs[0].id, 'DSM', 4],
        ['Banco de Dados Relacional',              60, profs[1].id, 'DSM', 3],
        ['Desenvolvimento Web',                    80, profs[2].id, 'DSM', 2],
        ['Estrutura de Dados',                     60, profs[0].id, 'DSM', 2],
      ];
      for (const d of disciplinas) {
        await pool.query(
          `INSERT INTO disciplinas (nome,carga_horaria,professor_id,curso,semestre)
           VALUES ($1,$2,$3,$4,$5)`,
          d
        );
      }
      console.log('✅ Disciplinas de exemplo inseridas');
    }

    // 5. Aluno de exemplo
    await pool.query(
      `INSERT INTO alunos (nome,matricula,curso,email,telefone,cep,endereco,cidade,estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (matricula) DO NOTHING`,
      ['Maria Souza','2024001','DSM','maria.souza@email.com',
       '(12) 99999-9999','12245-000','Rua das Flores, 123','São José dos Campos','SP']
    );
    console.log('✅ Aluno de exemplo inserido  →  matrícula: 2024001');

    // 6. Notas de exemplo
    const { rows: alunoRows } = await pool.query("SELECT id FROM alunos WHERE matricula='2024001'");
    const { rows: discRows  } = await pool.query('SELECT id FROM disciplinas LIMIT 3');
    if (alunoRows.length && discRows.length) {
      const notasEx = [
        [alunoRows[0].id, discRows[0].id, 8.5, 7.0],
        [alunoRows[0].id, discRows[1].id, 6.0, 5.5],
        [alunoRows[0].id, discRows[2].id, 4.0, 3.5],
      ];
      for (const [aId, dId, n1, n2] of notasEx) {
        const media    = ((n1 + n2) / 2).toFixed(2);
        const situacao = media >= 5 ? 'Aprovado' : 'Reprovado';
        await pool.query(
          `INSERT INTO notas (aluno_id,disciplina_id,nota1,nota2,media,situacao)
           VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (aluno_id,disciplina_id) DO NOTHING`,
          [aId, dId, n1, n2, media, situacao]
        );
      }
      console.log('✅ Notas de exemplo inseridas');
    }

    console.log('\n🚀 Setup concluído com sucesso!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Erro no setup:', err.message, '\n');
    process.exit(1);
  }
}

main();
