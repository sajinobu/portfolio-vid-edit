// Run with NODE_PATH pointing to a Playwright installation.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const base = process.env.QA_URL || "http://127.0.0.1:5173/";
  const out = path.resolve("artifacts/qa");
  fs.mkdirSync(out, { recursive: true });
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(out, "desktop.png"),
    fullPage: true,
  });
  assert.equal(await page.locator(".project-card").count(), 14);
  assert.equal(await page.getByText(/Trixy/i).count(), 0);
  assert.deepEqual(
    await page
      .locator(".hero-frame img")
      .evaluateAll((images) =>
        images.map((image) => image.getAttribute("src")),
      ),
    ["/media/deep-blue.jpg", "/media/akon-paycheck.jpg", "/media/chris.jpg"],
  );
  for (const [index, id] of ["deep-blue", "akon-paycheck", "chris"].entries()) {
    await page.locator(".hero-frame").nth(index).click();
    assert.equal(
      await page.locator("video").getAttribute("src"),
      `/media/${id}.mp4`,
    );
    await page.waitForFunction(
      () => document.querySelector("video")?.readyState >= 2,
    );
    await page.waitForFunction(
      () => document.querySelector("video")?.currentTime > 0.1,
    );
    await page.getByRole("button", { name: "Close video" }).click();
  }
  assert.equal(
    await page.locator("video").count(),
    0,
    "No videos downloaded before opening",
  );
  await page.getByRole("button", { name: "Clips", exact: true }).click();
  assert.equal(await page.locator(".project-card").count(), 3);
  assert.match(page.url(), /type=clips/);
  await page.getByRole("button", { name: "Motion", exact: true }).click();
  assert.equal(await page.locator(".project-card").count(), 6);
  await page.getByRole("button", { name: "Short-form", exact: true }).click();
  assert.equal(await page.locator(".project-card").count(), 3);
  await page.getByRole("button", { name: "Watch The Miyagi method." }).click();
  assert.equal(
    await page.locator("video").getAttribute("src"),
    "/media/miyagi.mp4",
  );
  await page.waitForFunction(
    () => document.querySelector("video")?.readyState >= 2,
  );
  await page.waitForFunction(
    () => document.querySelector("video")?.currentTime > 0.1,
  );
  await page.getByRole("button", { name: "Close video" }).click();
  await page.getByRole("button", { name: "All work" }).click();
  assert.equal(await page.locator(".project-card").count(), 14);
  await page.getByRole("button", { name: "AI UGC", exact: true }).click();
  assert.equal(await page.locator(".project-card").count(), 2);
  assert.match(page.url(), /type=ai-ugc/);
  assert.deepEqual(await page.locator('.project-card h3').allTextContents(), ['HairPeps UGC.', 'Room for the little things.']);
  await page.reload();
  assert.equal(await page.getByRole('button', { name: 'AI UGC', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('.project-card').count(), 2);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(out, 'ai-ugc-desktop.png') });
  await page.getByRole("button", { name: "All work" }).click();
  for (const title of [
    "Break the pattern.",
    "HairPeps UGC.",
    "Make it move.",
    "Room for the little things.",
    "A mystery in every page.",
  ]) {
    const card = page
      .locator(".project-card")
      .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
    assert.equal(await card.count(), 1);
    await card
      .getByRole("button", { name: `Watch ${title}`, exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelector("video")?.readyState >= 2,
    );
    await page.waitForFunction(
      () => document.querySelector("video")?.currentTime > 0.1,
    );
    await page.getByRole("button", { name: "Close video" }).click();
  }
  await page
    .locator(".project-card")
    .first()
    .getByRole("button", { name: "Watch A smaller circle." })
    .click();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  await page.waitForFunction(
    () => document.querySelector("video")?.readyState >= 2,
  );
  await page.waitForFunction(
    () => document.querySelector("video")?.currentTime > 0.1,
  );
  await page.screenshot({ path: path.join(out, "player-desktop.png") });
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").count(), 0);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.match(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    /Watch A smaller circle/,
  );
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  await page.evaluate(() => {
    document.activeElement.blur();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({ path: path.join(out, "light.png"), fullPage: true });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Copy email address" }).click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    "jennellesalva1215@gmail.com",
  );
  await page.goto(base + "?project=voxlearn");
  await page.waitForFunction(
    () => document.querySelector("video")?.readyState >= 2,
  );
  assert.equal(
    await page.locator("#player-title").innerText(),
    "From pages to podcasts.",
  );
  await page.getByRole("button", { name: "Close video" }).click();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert.ok(
      overflow.scroll <= overflow.width,
      `Overflow at ${width}: ${overflow.scroll}`,
    );
    if ([390, 768].includes(width))
      await page.screenshot({
        path: path.join(out, `viewport-${width}.png`),
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.screenshot({ path: path.join(out, "mobile-first-screen.png") });
  await page.getByRole("button", { name: "Open menu" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Close menu" })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.goto(base + "?project=electric-cars");
  await page.waitForFunction(
    () => document.querySelector("video")?.readyState >= 2,
  );
  await page.screenshot({ path: path.join(out, "player-mobile.png") });
  await page.getByRole("button", { name: "Close video" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        passed: true,
        viewports: [320, 390, 768, 1024, 1440],
        checks: [
          "filters",
          "all fourteen gallery entries",
          "new uploads and Voynich playback without duplication",
          "requested hero order and playback",
          "Miyagi playback",
          "on-demand playback",
          "Escape close",
          "focus restoration",
          "theme persistence",
          "copy email",
          "deep links",
          "mobile menu",
          "reduced motion",
          "no runtime errors",
        ],
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    "PASS: responsive layouts, filters, video playback, keyboard/focus, theme, contact, deep links, mobile menu, reduced motion.",
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
