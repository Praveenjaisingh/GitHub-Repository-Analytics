const request = require('supertest');
const app = require('../app');

describe('Health & basic routing', () => {
  it('GET /api/health returns 200 and status true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });

  it('GET /unknown-route returns 404', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  });

  it('GET /api/repositories/search without q returns 400', async () => {
    const res = await request(app).get('/api/repositories/search');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
  });
});
