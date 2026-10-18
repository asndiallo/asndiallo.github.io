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
  // Serves the built dist/ through Cloudflare's own asset server (workerd), so _headers,
  // _redirects and 404 handling behave as in production. Run `pnpm build` first.
  webServer: {
    command: `pnpm exec wrangler dev --port ${PORT} --ip localhost --show-interactive-dev-session=false`,
    env: { WRANGLER_SEND_METRICS: "false" },
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
