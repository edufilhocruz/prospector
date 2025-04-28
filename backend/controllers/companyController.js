const Company = require('../models/Company');
const axios = require('axios');

const fetchCnpjData = async (cnpj) => {
  try {
    const cleanCnpj = cnpj.replace(/[^\d]/g, '');
    const response = await axios.get(`https://minhareceita.org/${cleanCnpj}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar dados do CNPJ ${cnpj}:`, error.message);
    throw Object.assign(new Error(`CNPJ ${cnpj} não encontrado`), { status: 404 });
  }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const { tipo, uf, situacao_cadastral, page = 1, limit = 10 } = req.query;
    const query = {};

    if (tipo) query.descricao_identificador_matriz_filial = tipo.toUpperCase();
    if (uf) query.uf = uf.toUpperCase();
    if (situacao_cadastral) query.descricao_situacao_cadastral = situacao_cadastral.toUpperCase();

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const companies = await Company.paginate(query, options);
    res.status(200).json({
      companies: companies.docs,
      total: companies.totalDocs,
      page: companies.page,
      pages: companies.totalPages,
    });
  } catch (error) {
    next(error);
  }
};

exports.addCompany = async (req, res, next) => {
  try {
    const { cnpj } = req.body;
    const data = await fetchCnpjData(cnpj);
    const company = await Company.findOneAndUpdate(
      { cnpj: data.cnpj },
      data,
      { upsert: true, new: true }
    );

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};