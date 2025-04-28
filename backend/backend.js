const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o esquema da empresa
const CompanySchema = new mongoose.Schema({
  cnpj: { type: String, required: true, unique: true },
  identificador_matriz_filial: Number,
  descricao_identificador_matriz_filial: String,
  nome_fantasia: String,
  situacao_cadastral: Number,
  descricao_situacao_cadastral: String,
  data_situacao_cadastral: String,
  data_inicio_atividade: String,
  cnae_fiscal: Number,
  cnae_fiscal_descricao: String,
  uf: String,
  municipio: String,
  bairro: String,
  logradouro: String,
  numero: String,
  complemento: String,
  cep: String,
  razao_social: String,
  capital_social: Number,
  porte: String,
  opcao_pelo_simples: Boolean,
  opcao_pelo_mei: Boolean,
  natureza_juridica: String,
  ddd_telefone_1: String,
  ddd_telefone_2: String,
  email: String,
});

const Company = mongoose.model('Company', CompanySchema);

// Função para buscar dados de um CNPJ na API do Minha Receita
const fetchCnpjData = async (cnpj) => {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    const response = await axios.get(`https://minhareceita.org/${cleanCnpj}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar CNPJ ${cnpj}:`, error.message);
    return null;
  }
};

// Lista de CNPJs para preencher o banco de dados (adicione mais CNPJs reais)
const cnpjsToSeed = [
  '33683111000280', // Filial, DF
  '18083982000121', // Matriz, SP
  '07507651000166', // Matriz, RJ
  // Adicione mais CNPJs reais aqui
];

// Função para preencher o banco de dados
const seedDatabase = async () => {
  try {
    const count = await Company.countDocuments();
    if (count > 0) {
      console.log('Banco de dados já possui dados. Pulando seed.');
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
        console.log(`CNPJ ${cnpj} adicionado ao banco de dados`);
      }
    }
    console.log('Banco de dados preenchido com sucesso!');
  } catch (error) {
    console.error('Erro ao preencher o banco de dados:', error);
  }
};

// Executar o seed na inicialização
seedDatabase();

// Endpoint para buscar empresas com filtros
app.get('/empresas', async (req, res) => {
  try {
    const {
      tipo,
      data_abertura_inicial,
      data_abertura_final,
      situacao_cadastral,
      uf,
      municipio,
      bairro,
      cep,
      com_telefone,
      tipo_telefone,
      com_email,
      tipo_email,
      cnaes,
      simples_nacional,
      mei,
      razao_social,
      porte,
      capital_social_min,
      capital_social_max,
      natureza_juridica,
    } = req.query;

    console.log("Parâmetros recebidos:", req.query);

    const query = {};

    if (tipo) {
      const tipos = tipo.split(",").map(t => t.trim().toUpperCase());
      query.descricao_identificador_matriz_filial = { $in: tipos };
    }

    if (data_abertura_inicial) {
      query.data_inicio_atividade = { ...query.data_inicio_atividade, $gte: data_abertura_inicial };
    }

    if (data_abertura_final) {
      query.data_inicio_atividade = { ...query.data_inicio_atividade, $lte: data_abertura_final };
    }

    if (situacao_cadastral) {
      const situacoes = situacao_cadastral.split(",").map(s => s.trim().toUpperCase());
      query.descricao_situacao_cadastral = { $in: situacoes };
    }

    if (uf) {
      const ufs = uf.split(",").map(u => u.trim().toUpperCase());
      query.uf = { $in: ufs };
    }

    if (municipio) {
      const municipios = municipio.split(",").map(m => m.trim().toUpperCase());
      query.municipio = { $in: municipios };
    }

    if (bairro) {
      const bairros = bairro.split(",").map(b => b.trim().toUpperCase());
      query.bairro = { $in: bairros };
    }

    if (cep) {
      query.cep = cep.replace(/[^\d]/g, "");
    }

    if (com_telefone === "true") {
      query.$or = [
        { ddd_telefone_1: { $ne: "" } },
        { ddd_telefone_2: { $ne: "" } },
      ];
      if (tipo_telefone) {
        const tiposTelefone = tipo_telefone.split(",").map(t => t.trim().toUpperCase());
        if (tiposTelefone.includes("FIXO")) {
          query.ddd_telefone_1 = { $ne: "" };
        }
        if (tiposTelefone.includes("CELULAR")) {
          query.ddd_telefone_2 = { $ne: "" };
        }
      }
    }

    if (com_email === "true") {
      query.email = { $ne: "" };
      if (tipo_email) {
        const tiposEmail = tipo_email.split(",").map(e => e.trim().toUpperCase());
        if (tiposEmail.includes("EMPRESARIAL")) {
          query.email = { $regex: "@.*\\..*", $options: "i" };
        }
      }
    }

    if (cnaes) {
      const cnaesList = cnaes.split(",").map(c => Number(c.trim()));
      query.cnae_fiscal = { $in: cnaesList };
    }

    if (simples_nacional && simples_nacional !== "todos_simples") {
      query.opcao_pelo_simples = simples_nacional.toUpperCase() === "SIM";
    }

    if (mei && mei !== "todos_mei") {
      query.opcao_pelo_mei = mei.toUpperCase() === "SIM";
    }

    if (razao_social) {
      query.razao_social = { $regex: razao_social, $options: "i" };
    }

    if (porte) {
      const portes = porte.split(",").map(p => p.trim().toUpperCase());
      query.porte = { $in: portes };
    }

    if (capital_social_min) {
      query.capital_social = { ...query.capital_social, $gte: Number(capital_social_min) };
    }

    if (capital_social_max) {
      query.capital_social = { ...query.capital_social, $lte: Number(capital_social_max) };
    }

    if (natureza_juridica) {
      const naturezas = natureza_juridica.split(",").map(n => n.trim().toUpperCase());
      query.natureza_juridica = { $in: naturezas };
    }

    console.log("Query para o MongoDB:", query);
    const companies = await Company.find(query);
    console.log("Empresas encontradas:", companies);

    res.json(companies);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    res.status(500).json({ message: "Erro ao buscar empresas" });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});