const express = require('express');
const cors = require('cors');
const empresasRoutes = require('./routes/empresas');
const errorMiddleware = require('./middlewares/errorMiddleware');
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/empresas', empresasRoutes);

// Middleware de tratamento de erros (opcional, recomendado)
app.use(errorMiddleware);

module.exports = app;