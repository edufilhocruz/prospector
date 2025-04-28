const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const empresasRoutes = require('./routes/empresas');
const errorMiddleware = require('./middlewares/errorMiddleware');

dotenv.config();

const app = express();

// Configurar CORS para permitir requisições de localhost:4000
app.use(cors({
  origin: 'http://localhost:4000', // Origem do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middlewares
app.use(express.json());

// Rotas
app.use('/empresas', empresasRoutes);

// Middleware de erro
app.use(errorMiddleware);

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado ao MongoDB');
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app; 