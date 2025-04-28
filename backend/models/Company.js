const mongoose = require('mongoose');

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

module.exports = mongoose.model('Company', CompanySchema);
