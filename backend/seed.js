const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const cnpjsToSeed = [
  '33683111000280', // Matriz
  '18083982000121', // Matriz
  '07507651000166', // Matriz
  '11222333000181', // Outro exemplo
  '11445566000199', // Outro exemplo
];

const fetchCnpjData = async (cnpj) => {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    const response = await axios.get(`https://minhareceita.org/${cleanCnpj}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados do CNPJ ${cnpj}:`, error.message);
    return null;
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Conectado ao MongoDB.');

    const count = await Company.countDocuments();
    if (count > 0) {
      console.log('Banco de dados já possui dados. Pulando seed.');
      await mongoose.disconnect();
      return;
    }

    console.log('Preenchendo o banco de dados...');
    for (const cnpj of cnpjsToSeed) {
      const data = await fetchCnpjData(cnpj);
      if (data) {
        await Company.findOneAndUpdate(
          { cnpj: data.cnpj },
          data,
          { upsert: true, new: true }
        );
        console.log(`Empresa com CNPJ ${cnpj} adicionada.`);
      }
    }

    console.log('Banco de dados preenchido com sucesso!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao preencher o banco de dados:', error.message);
    await mongoose.disconnect();
  }
};

seedDatabase();