const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    headless: true,
    actionTimeout: 5000,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node backend/src/server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    env: {
      ADMIN_PASSWORD: 'testpass',
      PGHOST: process.env.PGHOST || 'localhost',
      PGPORT: process.env.PGPORT || '5432',
      PGUSER: process.env.PGUSER || 'DeMalaECuia',
      PGPASSWORD: process.env.PGPASSWORD || 'ProjetoES',
      PGDATABASE: process.env.PGDATABASE || 'cookie_shop',
    },
  },
});
