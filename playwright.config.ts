import { defineConfig, devices } from "@playwright/test";

const PORT = 4399;

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  // Serves the built dist/ (run `pnpm build` first). --ignore-lock keeps it in the foreground.
  webServer: {
    command: `pnpm exec astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
