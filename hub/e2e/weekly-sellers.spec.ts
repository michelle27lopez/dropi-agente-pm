/**
 * E2E Test Suite — Weekly Célula Seller Success
 * Validates routes, components, interactive slide deck navigation and Vercel production readiness.
 */

import { test, expect } from '@playwright/test';

test.describe('Weekly Célula Seller Success E2E Suite', () => {

  test('1. Main Hub page renders the Weekly Sellers Update card', async ({ page }) => {
    await page.goto('/');
    const updateCard = page.locator('text=Weekly · Célula Sellers');
    await expect(updateCard).toBeVisible();
  });

  test('2. Sellers Célula page renders WeeklyBanner component', async ({ page }) => {
    await page.goto('/celula/sellers');
    
    // Verify Banner title and button
    const bannerTitle = page.locator('text=Weekly Célula Seller Success');
    await expect(bannerTitle).toBeVisible();

    const bannerBtn = page.locator('a[href="/proyectos/weekly-sellers"]');
    await expect(bannerBtn).toBeVisible();
    await expect(bannerBtn).toHaveText(/Abrir Espacio Weekly/);
  });

  test('3. Dedicated Route /proyectos/weekly-sellers embeds interactive slide deck', async ({ page }) => {
    await page.goto('/proyectos/weekly-sellers');

    // Verify Iframe element
    const iframe = page.locator('iframe[title="Weekly Célula Seller Success"]');
    await expect(iframe).toBeVisible();
  });

  test('4. Interactive Slide Deck HTML Prototype Navigation', async ({ page }) => {
    await page.goto('/prototipos/weekly-celula.html');

    // Verify Title & Live Badge
    await expect(page.locator('text=Weekly de Célula Seller Success')).toBeVisible();

    // Verify Participants List includes CS & SAC Leads
    await expect(page.locator('text=Jose Hurtado')).toBeVisible();
    await expect(page.locator('text=Customer Success Lead')).toBeVisible();
    await expect(page.locator('text=Laura Núñez')).toBeVisible();
    await expect(page.locator('text=SAC Lead (Soporte)')).toBeVisible();

    // Test Navigation: Click Next Slide button
    const nextBtn = page.locator('button:has-text("Siguiente")');
    await nextBtn.click();

    // Counter updates to Slide 2
    const counter = page.locator('#slide-counter');
    await expect(counter).toHaveText('Slide 2 de 13');
  });

});
