const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Company = require('./models/Company');

dotenv.config();

const cnpjsToSeed = [
  '00360305000104', // Matriz, SP (Petrobras)
  '33683111000280', // Filial, DF
  '06990590000204', // Matriz, RJ (Rede Globo, novo CNPJ válido)
  '09296295000160', // Matriz, SP (Amazon Brasil)
];

// Função para validar o formato do CNPJ
const validateCnpj = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;

  // Validação dos dígitos verificadores
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
};

const fetchCnpjData = async (cnpj) => {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    if (!validateCnpj(cleanCnpj)) {
      console.error(`CNPJ ${cleanCnpj} inválido (formato incorreto).`);
      return null;
    }

    console.log(`Buscando dados do CNPJ ${cleanCnpj}...`);
    const response = await axios.get(`https://minhareceita.org/${cleanCnpj}`, {
      timeout: 5000,
    });
    console.log(`Dados do CNPJ ${cleanCnpj} recebidos com sucesso.`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados do CNPJ ${cnpj}:`, {
      message: error.message,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
    });
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conectado ao MongoDB.');
    }

    const count = await Company.countDocuments();
    if (count > 0) {
      console.log('Banco de dados já possui dados. Pulando seed.');
      await mongoose.disconnect();
      return;
    }

    console.log('Preenchendo o banco de dados...');
    let addedCount = 0;

    for (const cnpj of cnpjsToSeed) {
      const data = await fetchCnpjData(cnpj);
      if (data) {
        await Company.findOneAndUpdate(
          { cnpj: data.cnpj },
          data,
          { upsert: true, new: true }
        );
        console.log(`Empresa com CNPJ ${cnpj} adicionada.`);
        addedCount++;
      }
      console.log('Aguardando delay de 2 segundos...');
      await delay(2000);
    }

    console.log(`Banco de dados preenchido com sucesso! ${addedCount} empresas adicionadas de ${cnpjsToSeed.length} tentativas.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao preencher o banco de dados:', error.message);
    await mongoose.disconnect();
  }
};

seedDatabase();