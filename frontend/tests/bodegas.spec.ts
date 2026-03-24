import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3000';

test.describe('Gestión de Bodegas', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
  });

  test('Ver lista de bodegas', async ({ page }) => {
    await page.goto(`${BASE_URL}/bodegas`);
    
    await expect(page.locator('h1:has-text("Gestión de Bodegas")')).toBeVisible();
  });

  test('Crear nueva bodega', async ({ page }) => {
    const uniqueCode = `BOD-${Date.now().toString().slice(-6)}`;
    
    await page.goto(`${BASE_URL}/bodegas/nuevo`);
    
    await page.fill('input[placeholder*="BOD"]', uniqueCode);
    await page.fill('input[placeholder*="Nombre"]', 'Bodega Test E2E');
    await page.click('button:has-text("Guardar")');
    
    // Verificar redirección
    await page.waitForURL('**/bodegas', { timeout: 10000 });
    
    // Verificar que aparece
    await expect(page.locator(`text=${uniqueCode}`)).toBeVisible({ timeout: 5000 });
  });
});
