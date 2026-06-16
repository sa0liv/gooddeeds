require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const dns = require('dns');

// Prefer IPv4 to avoid IPv6 timeouts on some networks.
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  `http://localhost:${PORT}`,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Origem não permitida pelo CORS'));
  },
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);

app.use((err, req, res, next) => {
  console.error('[GlobalError]', err.message, err.stack);
  if (res.headersSent) return next(err);
  res.status(500).json({ erro: err.message || 'Erro interno do servidor' });
});

// ---- Frontend (SPA) integrado ----
const path = require('path');
const fs = require('fs');

// Em dev: dist fica em backend/dist
// Em pkg (exe): dist fica na mesma pasta do executável
const distDir = process.pkg
  ? path.join(path.dirname(process.execPath), 'dist')
  : path.join(__dirname, '..', 'dist');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  console.warn(`[WARN] Pasta frontend build nao encontrada: ${distDir}. UI pode nao carregar.`);
}

app.listen(PORT, () => {
  console.log(`Servidor GoodDeeds rodando na porta ${PORT}`);
});

module.exports = app;


