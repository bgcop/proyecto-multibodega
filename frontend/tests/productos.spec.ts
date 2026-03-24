import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3000';

test.describe('Gestión de Productos', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Crear admin y obtener token
    await request.post(`${API_URL}/api/auth/seed-admin`);
    const loginRes = await request.post(`${API_URL}/api/auth/login`, {
      data: { email: 'admin@sistema.local', password: 'admin123' }
    });
    const loginData = await loginRes.json();
    authToken = loginData.access_token;
  });

  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
  });

  test('Ver lista de productos', async ({ page }) => {
    await page.goto(`${BASE_URL}/productos`);
    
    await expect(page.locator('h1:has-text("Catálogo de Productos")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('Crear nuevo producto', async ({ page }) => {
    const uniqueSku = `SKU-TEST-${Date.now()}`;
    
    await page.goto(`${BASE_URL}/productos/nuevo`);
    
    await page.fill('input[placeholder*="SKU"]', uniqueSku);
    await page.fill('input[placeholder*="Nombre"]', 'Producto Test E2E');
    await page.fill('input[type="number"]', '99.99');
    await page.click('button:has-text("Guardar")');
    
    // Verificar redirección a lista
    await page.waitForURL('**/productos', { timeout: 10000 });
    
    // Verificar que el producto aparece en la lista
    await expect(page.locator(`text=${uniqueSku}`)).toBeVisible({ timeout: 5000 });
  });

  test('SKU duplicado muestra error', async ({ page, request }) => {
    // Crear producto primero via API
    await request.post(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { sku: 'DUPLICATE-SKU', name: 'Producto Existente', price: 10, minStock: 1 }
    });
    
    await page.goto(`${BASE_URL}/productos/nuevo`);
    
    await page.fill('input[placeholder*="SKU"]', 'DUPLICATE-SKU');
    await page.fill('input[placeholder*="Nombre"]', 'Producto Duplicado');
    await page.fill('input[type="number"]', '50');
    await page.click('button:has-text("Guardar")');
    
    // Verificar alerta de error
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Error');
      dialog.accept();
    });
  });
});
