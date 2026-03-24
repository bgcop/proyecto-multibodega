import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@sistema.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
  });

  test('Dashboard muestra KPIs', async ({ page }) => {
    await expect(page.locator('text=Total Productos')).toBeVisible();
    await expect(page.locator('text=Bodegas Activas')).toBeVisible();
    await expect(page.locator('text=Movimientos Hoy')).toBeVisible();
    await expect(page.locator('text=Alertas de Stock')).toBeVisible();
  });

  test('Navegación sidebar funciona', async ({ page }) => {
    // Ir a productos
    await page.click('a[href="/productos"]');
    await expect(page).toHaveURL('**/productos');
    
    // Ir a bodegas
    await page.click('a[href="/bodegas"]');
    await expect(page).toHaveURL('**/bodegas');
    
    // Ir a transferencias
    await page.click('a[href="/transferencias"]');
    await expect(page).toHaveURL('**/transferencias');
    
    // Volver al dashboard
    await page.click('a[href="/"]');
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Tarjetas de acceso rápido funcionan', async ({ page }) => {
    // Click en Nueva Transferencia
    await page.click('a:has-text("Nueva Transferencia")');
    await expect(page).toHaveURL('**/transferencias');
  });
});
