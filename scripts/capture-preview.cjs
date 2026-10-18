const { chromium } = require("playwright");
const path = require("node:path");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto(process.env.QA_URL || "http://127.0.0.1:5173/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.resolve("artifacts/qa/desktop-first-screen.png"),
  });
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.screenshot({
    path: path.resolve("public/social-preview.jpg"),
    type: "jpeg",
    quality: 90,
  });
  await browser.close();
  console.log("Saved portfolio preview and social image.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
