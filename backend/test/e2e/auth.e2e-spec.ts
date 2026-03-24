import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Autenticación E2E (JWT)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/seed-admin debe crear el usuario admin', () => {
    return request(app.getHttpServer())
      .post('/api/auth/seed-admin')
      .expect(201);
  });

  it('POST /api/auth/login con credenciales válidas retorna JWT', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.local', password: 'admin123' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(typeof res.body.access_token).toBe('string');
      });
  });

  it('POST /api/auth/login con credenciales inválidas retorna 401', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.local', password: 'wrongpassword' })
      .expect(401);
  });

  it('GET /api/products SIN token retorna 200 (endpoint público)', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200);
  });

  it('POST /api/products SIN token retorna 401 (endpoint protegido)', () => {
    return request(app.getHttpServer())
      .post('/api/products')
      .send({ sku: 'TEST-001', name: 'Test Product', price: 100, minStock: 5 })
      .expect(401);
  });
});
