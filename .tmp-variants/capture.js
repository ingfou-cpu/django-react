const puppeteer = require('puppeteer');

const BASE = 'http://127.0.0.1:5173';
const OUT = 'E:/Django/Agence_de_voyage/.tmp-variants';
const TARGETS = [
  { file: 'actuel.png', url: `${BASE}/` },
  { file: 'v1.png', url: `${BASE}/?v=1` },
  { file: 'v2.png', url: `${BASE}/?v=2` },
  { file: 'v3.png', url: `${BASE}/?v=3` },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const t of TARGETS) {
    const errors = [];
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push('CONSOLE: ' + m.text());
    });

    try {
      await page.goto(t.url, { waitUntil: 'load', timeout: 45000 });
      await sleep(2500);

      // Scroll to trigger Reveal animations + lazy images.
      const h = await page.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y <= h; y += 450) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await sleep(160);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(600);

      const fn = `${OUT}/${t.file}`;
      await page.screenshot({ path: fn, fullPage: true });
      console.log(`OK  ${t.file}  (height ${h}px)  errors: ${errors.length}`);
      errors.slice(0, 8).forEach((e) => console.log('    ' + e));
    } catch (err) {
      console.log(`ERR ${t.file}: ${err.message}`);
      errors.slice(0, 8).forEach((e) => console.log('    ' + e));
    }
    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
  }

  await browser.close();
})();
