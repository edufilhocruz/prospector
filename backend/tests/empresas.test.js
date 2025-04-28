const request = require('supertest');
const app = require('../backend');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const axios = require('axios');
require('dotenv').config();

jest.mock('axios');

describe('Testes do Endpoint /empresas', () => {
  let server;

  beforeAll(async () => {
    if (!process.env.MONGODB_TEST_URI) {
      throw new Error('MONGODB_TEST_URI não está definido no arquivo .env');
    }

    await mongoose.connect(process.env.MONGODB_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server = app.listen(0);

    await Company.insertMany([
      {
        cnpj: '00360305000104',
        descricao_identificador_matriz_filial: 'MATRIZ',
        uf: 'SP',
        razao_social: 'EMPRESA TESTE 1',
        data_inicio_atividade: '2020-01-01',
        descricao_situacao_cadastral: 'ATIVA',
      },
      {
        cnpj: '09296295000160',
        descricao_identificador_matriz_filial: 'MATRIZ',
        uf: 'SP',
        razao_social: 'EMPRESA TESTE 2',
        data_inicio_atividade: '2019-05-10',
        descricao_situacao_cadastral: 'ATIVA',
      },
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await server.close();
  });

  it('Deve retornar empresas com filtro tipo=MATRIZ e uf=SP', async () => {
    const response = await request(app)
      .get('/empresas?tipo=MATRIZ&uf=SP')
      .expect(200);

    expect(response.body).toHaveProperty('companies');
    expect(response.body.companies).toHaveLength(2);
    expect(response.body).toHaveProperty('total', 2);
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('pages');
  });

  it('Deve adicionar uma nova empresa', async () => {
    axios.get.mockResolvedValue({
      data: {
        cnpj: '06990590000204',
        razao_social: 'REDE GLOBO',
        uf: 'RJ',
        descricao_identificador_matriz_filial: 'MATRIZ',
        data_inicio_atividade: '1965-04-26',
        descricao_situacao_cadastral: 'ATIVA',
      },
    });

    const response = await request(app)
      .post('/empresas')
      .send({ cnpj: '06990590000204' })
      .expect(201);

    expect(response.body).toHaveProperty('cnpj', '06990590000204');
    expect(response.body.razao_social).toBe('REDE GLOBO');
  });

  it('Deve retornar erro 400 se o CNPJ não for fornecido', async () => {
    const response = await request(app)
      .post('/empresas')
      .send({})
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toBe('CNPJ é obrigatório');
  });
});