const request = require('supertest');
const app = require('../backend'); // seu backend.js precisa exportar `app`
const mongoose = require('mongoose');

describe('GET /empresas', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('Deve retornar 200 e uma lista de empresas', async () => {
    const response = await request(app).get('/empresas');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
