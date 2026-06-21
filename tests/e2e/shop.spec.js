const { test, expect } = require('@playwright/test');

test.describe('Loja De Mala e Cuia', () => {
  test('menu é exibido e produtos aparecem', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h3')).toHaveText('Nossos Biscoitos');
    await expect(page.locator('.product-card')).toHaveCountGreaterThan(0);
  });

  test('adiciona produto ao carrinho e exibe total', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-btn').first().click();
    await page.click('.cart-toggle');
    await expect(page.locator('#cartItems .cart-item')).toHaveCount(1);
    await expect(page.locator('#subtotal')).not.toHaveText('R$ 0,00');
  });

  test('finaliza pedido e abre popup do whatsapp', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-btn').first().click();
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('.checkout-direct'),
    ]);
    await expect(popup).toHaveURL(/whatsapp.com/);
  });

  test('admin page carrega e exibe campo de senha', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Gestão do Cardápio');
  });
});
