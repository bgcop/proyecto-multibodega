import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Stock Transfer E2E (ACID)', () => {
  let app: INestApplication;
  let authToken: string;
  let productId: number;
  let warehouseAId: number;
  let warehouseBId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Crear admin y obtener token
    await request(app.getHttpServer()).post('/api/auth/seed-admin');
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@sistema.local', password: 'admin123' });
    authToken = loginRes.body.access_token;

    // Crear bodegas
    const whA = await request(app.getHttpServer())
      .post('/api/warehouses')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({ code: 'WH-A', name: 'Bodega A Test' });
    warehouseAId = whA.body.id;

    const whB = await request(app.getHttpServer())
      .post('/api/warehouses')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({ code: 'WH-B', name: 'Bodega B Test' });
    warehouseBId = whB.body.id;

    // Crear producto
    const prod = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({ sku: 'PROD-TEST-001', name: 'Producto Test E2E', price: 50, minStock: 10 });
    productId = prod.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Transferencia SIN stock en origen debe rechazarse (400)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/stock-movements/transfer')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({
        productId,
        sourceWarehouseId: warehouseAId,
        targetWarehouseId: warehouseBId,
        quantity: 10,
        reason: 'Test sin stock',
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Stock insuficiente');
  });

  it('Transferencia a la MISMA bodega debe rechazarse (400)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/stock-movements/transfer')
      .set('Authorization', \`Bearer \${authToken}\`)
      .send({
        productId,
        sourceWarehouseId: warehouseAId,
        targetWarehouseId: warehouseAId,
        quantity: 5,
        reason: 'Test misma bodega',
      });
    
    expect(res.status).toBe(400);
  });

  it('Transferencia SIN JWT debe rechazarse (401)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/stock-movements/transfer')
      .send({
        productId,
        sourceWarehouseId: warehouseAId,
        targetWarehouseId: warehouseBId,
        quantity: 5,
        reason: 'Test sin auth',
      });
    
    expect(res.status).toBe(401);
  });
});
