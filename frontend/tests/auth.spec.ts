import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3000';

test.describe('Autenticación', () => {
  test.beforeAll(async ({ request }) => {
    // Asegurar que existe el admin
    await request.post(`${API_URL}/api/auth/seed-admin`);
  });

  test('Login exitoso redirige al Dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Esperar redirección al dashboard
    await page.waitForURL('**/', { timeout: 10000 });
    await expect(page).toHaveURL(BASE_URL + '/');
    
    // Verificar que el dashboard cargó
    await expect(page.locator('text=Total Productos')).toBeVisible({ timeout: 5000 });
  });

  test('Login fallido muestra error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verificar mensaje de error
    await expect(page.locator('text=Credenciales inválidas')).toBeVisible({ timeout: 5000 });
  });
});
