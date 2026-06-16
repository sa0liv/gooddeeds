require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const pool = require('./database');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id                SERIAL PRIMARY KEY,
      nome              VARCHAR(255) NOT NULL,
      email             VARCHAR(255) UNIQUE NOT NULL,
      senha             VARCHAR(255) NOT NULL,
      telefone          VARCHAR(20),
      tipo_perfil       VARCHAR(20) DEFAULT 'VOLUNTARIO' CHECK (tipo_perfil IN ('VOLUNTARIO', 'ORGANIZADOR')),
      habilidades       TEXT[] DEFAULT ARRAY[]::TEXT[],
      areas_interesse   TEXT[] DEFAULT ARRAY[]::TEXT[],
      cidade            VARCHAR(100),
      created_at        TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS habilidades TEXT[] DEFAULT ARRAY[]::TEXT[]`);
  await pool.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS areas_interesse TEXT[] DEFAULT ARRAY[]::TEXT[]`);
  await pool.query(`ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cidade VARCHAR(100)`);
  console.log('Tabela usuarios criada/verificada com sucesso.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS eventos (
      id            SERIAL PRIMARY KEY,
      titulo        VARCHAR(255) NOT NULL,
      descricao     TEXT NOT NULL,
      categoria     VARCHAR(50) NOT NULL,
      cidade        VARCHAR(100) NOT NULL,
      local         VARCHAR(255) NOT NULL,
      data          DATE NOT NULL,
      horario       TIME NOT NULL,
      vagas         INTEGER NOT NULL CHECK (vagas > 0),
      carga_horaria DECIMAL(5, 2),
      requisitos    TEXT,
      habilidades   TEXT[] DEFAULT ARRAY[]::TEXT[],
      criador_id    INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      created_at    TIMESTAMP DEFAULT NOW(),
      updated_at    TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Tabela eventos criada/verificada com sucesso.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inscricoes (
      id          SERIAL PRIMARY KEY,
      usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      evento_id   INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
      status      VARCHAR(20) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'CANCELADA')),
      created_at  TIMESTAMP DEFAULT NOW(),
      UNIQUE(usuario_id, evento_id)
    );
  `);
  await pool.query(`ALTER TABLE inscricoes ADD COLUMN IF NOT EXISTS presenca BOOLEAN DEFAULT NULL`);
  console.log('Tabela inscricoes criada/verificada com sucesso.');

  await pool.query(`ALTER TABLE eventos ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ATIVO'`);
  console.log('Coluna status adicionada/verificada em eventos.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id                      SERIAL PRIMARY KEY,
      evento_id               INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
      voluntario_id           INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      organizacao_nota        INTEGER NOT NULL CHECK (organizacao_nota BETWEEN 1 AND 5),
      comunicacao_nota        INTEGER NOT NULL CHECK (comunicacao_nota BETWEEN 1 AND 5),
      clareza_nota            INTEGER NOT NULL CHECK (clareza_nota BETWEEN 1 AND 5),
      experiencia_nota        INTEGER NOT NULL CHECK (experiencia_nota BETWEEN 1 AND 5),
      melhor_parte_texto      TEXT,
      pontos_melhoria_texto   TEXT,
      comentarios_adicionais  TEXT,
      created_at              TIMESTAMP DEFAULT NOW(),
      UNIQUE(voluntario_id, evento_id)
    );
  `);
  console.log('Tabela avaliacoes criada/verificada com sucesso.');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS avaliacoes_voluntarios (
      id                       SERIAL PRIMARY KEY,
      evento_id                INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
      voluntario_id            INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      organizador_id           INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      pontualidade_nota        INTEGER NOT NULL CHECK (pontualidade_nota BETWEEN 1 AND 5),
      colaboracao_nota         INTEGER NOT NULL CHECK (colaboracao_nota BETWEEN 1 AND 5),
      comprometimento_nota     INTEGER NOT NULL CHECK (comprometimento_nota BETWEEN 1 AND 5),
      desempenho_nota          INTEGER NOT NULL CHECK (desempenho_nota BETWEEN 1 AND 5),
      pontos_fortes_texto      TEXT,
      pontos_melhoria_texto    TEXT,
      comentarios_adicionais   TEXT,
      created_at               TIMESTAMP DEFAULT NOW(),
      UNIQUE(organizador_id, voluntario_id, evento_id)
    );
  `);
  console.log('Tabela avaliacoes_voluntarios criada/verificada com sucesso.');

  await pool.end();
}

migrate().catch(err => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
