const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

// Adicionar índices para os campos mais usados nos filtros
CompanySchema.index({ uf: 1 });
CompanySchema.index({ descricao_identificador_matriz_filial: 1 });
CompanySchema.index({ descricao_situacao_cadastral: 1 });
CompanySchema.index({ municipio: 1 });
CompanySchema.index({ bairro: 1 });
CompanySchema.index({ cep: 1 });
CompanySchema.index({ cnae_fiscal: 1 });
CompanySchema.index({ razao_social: 'text' });

// Adicionar o plugin de paginação
CompanySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Company', CompanySchema);
