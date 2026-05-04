require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const pool = require('./database');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id          SERIAL PRIMARY KEY,
      nome        VARCHAR(255) NOT NULL,
      email       VARCHAR(255) UNIQUE NOT NULL,
      senha       VARCHAR(255) NOT NULL,
      telefone    VARCHAR(20),
      tipo_perfil VARCHAR(20) NOT NULL DEFAULT 'VOLUNTARIO'
                  CHECK (tipo_perfil IN ('VOLUNTARIO', 'ORGANIZADOR')),
      created_at  TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Tabela usuarios criada/verificada com sucesso.');
  await pool.end();
}

migrate().catch(err => {
  console.error('Erro na migração:', err);
  process.exit(1);
});
