const Company = require('../models/Company');

exports.getCompanies = async (req, res, next) => {
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

    const query = {};

    if (tipo) {
      const tipos = tipo.split(",").map(t => t.trim());
      query.descricao_identificador_matriz_filial = { $in: tipos.map(t => new RegExp(`^${t}$`, 'i')) };
    }

    if (data_abertura_inicial) {
      query.data_inicio_atividade = { ...query.data_inicio_atividade, $gte: data_abertura_inicial };
    }

    if (data_abertura_final) {
      query.data_inicio_atividade = { ...query.data_inicio_atividade, $lte: data_abertura_final };
    }

    if (situacao_cadastral) {
      const situacoes = situacao_cadastral.split(",").map(s => s.trim());
      query.descricao_situacao_cadastral = { $in: situacoes.map(s => new RegExp(`^${s}$`, 'i')) };
    }

    if (uf) {
      const ufs = uf.split(",").map(u => u.trim());
      query.uf = { $in: ufs.map(u => new RegExp(`^${u}$`, 'i')) };
    }

    if (municipio) {
      const municipios = municipio.split(",").map(m => m.trim());
      query.municipio = { $in: municipios.map(m => new RegExp(`^${m}$`, 'i')) };
    }

    if (bairro) {
      const bairros = bairro.split(",").map(b => b.trim());
      query.bairro = { $in: bairros.map(b => new RegExp(`^${b}$`, 'i')) };
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
      const portes = porte.split(",").map(p => p.trim());
      query.porte = { $in: portes.map(p => new RegExp(`^${p}$`, 'i')) };
    }

    if (capital_social_min) {
      query.capital_social = { ...query.capital_social, $gte: Number(capital_social_min) };
    }

    if (capital_social_max) {
      query.capital_social = { ...query.capital_social, $lte: Number(capital_social_max) };
    }

    if (natureza_juridica) {
      const naturezas = natureza_juridica.split(",").map(n => n.trim());
      query.natureza_juridica = { $in: naturezas.map(n => new RegExp(`^${n}$`, 'i')) };
    }

    const companies = await Company.find(query);

    res.json(companies);
  } catch (error) {
    next(error); // usa o middleware de erro
  }
};
