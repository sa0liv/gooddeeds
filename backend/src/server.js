require('dotenv').config();
const dns = require('dns');

// Prefer IPv4 to avoid IPv6 timeouts on some networks.
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
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

app.listen(PORT, () => {
  console.log(`Servidor GoodDeeds rodando na porta ${PORT}`);
});

module.exports = app;
