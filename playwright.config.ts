import { defineConfig } from "@playwright/test";
process.env.CHROME_PATH ??= "/usr/bin/google-chrome";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 390, height: 844 },
    launchOptions: { executablePath: process.env.CHROME_PATH },
  },
  webServer: {
    command: "node scripts/serve-static.mjs",
    url: "http://localhost:3000/",
    reuseExistingServer: !process.env.CI,
  },
});
