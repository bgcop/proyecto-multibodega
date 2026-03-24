import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3000';

test.describe('Transferencias de Stock', () => {
  let authToken: string;
  let productId: number;
  let warehouseAId: number;
  let warehouseBId: number;

  test.beforeAll(async ({ request }) => {
    // Login
    await request.post(`${API_URL}/api/auth/seed-admin`);
    const loginRes = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@sistema.local', password: 'admin123' }
    });
    const loginData = await loginRes.json();
    authToken = loginData.access_token;

    // Crear bodegas
    const whA = await request.post(`${API_URL}/api/warehouses`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { code: `WH-A-${Date.now()}`, name: 'Bodega Origen Test' }
    });
    warehouseAId = (await whA.json()).id;

    const whB = await request.post(`${API_URL}/api/warehouses`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { code: `WH-B-${Date.now()}`, name: 'Bodega Destino Test' }
    });
    warehouseBId = (await whB.json()).id;

    // Crear producto
    const prod = await request.post(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { sku: `PROD-TR-${Date.now()}`, name: 'Producto Transfer Test', price: 100, minStock: 5 }
    });
    productId = (await prod.json()).id;
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
  });

  test('Ver página de transferencias', async ({ page }) => {
    await page.goto(`${BASE_URL}/transferencias`);
    
    await expect(page.locator('h1:has-text("Transferencia de Mercadería")')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('Transferencia sin stock muestra error', async ({ page }) => {
    await page.goto(`${BASE_URL}/transferencias`);
    
    // Seleccionar producto
    await page.selectOption('select:first-of-type', { label: /Producto Transfer Test/ });
    
    // Seleccionar bodegas
    await page.selectOption('select:nth-of-type(2)', { label: /Bodega Origen/ });
    await page.selectOption('select:nth-of-type(3)', { label: /Bodega Destino/ });
    
    // Cantidad
    await page.fill('input[type="number"]', '10');
    
    // Ejecutar
    await page.click('button:has-text("Ejecutar")');
    
    // Verificar error de stock insuficiente
    await expect(page.locator('text=Stock insuficiente')).toBeVisible({ timeout: 5000 });
  });

  test('Misma bodega bloqueada', async ({ page }) => {
    await page.goto(`${BASE_URL}/transferencias`);
    
    await page.selectOption('select:first-of-type', { label: /Producto Transfer Test/ });
    await page.selectOption('select:nth-of-type(2)', { label: /Bodega Origen/ });
    
    // La bodega destino no debería mostrar la misma opción
    const destinoOptions = await page.locator('select:nth-of-type(3) option').allTextContents();
    expect(destinoOptions.join()).not.toContain('Bodega Origen Test');
  });
});
