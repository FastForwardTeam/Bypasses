import { Page } from 'puppeteer';
import fs from 'fs';

function waitForURL(page: Page, url: string, timeout: number) {
  return new Promise<string>((rev) => {
    let count = 0;

    function check(resolve: (value: (string | PromiseLike<string>)) => void) {
      const pageURL = page.url();
      if (pageURL === url) {
        resolve(pageURL);
      } else if (count++ > timeout / 500) {
        resolve(pageURL);
      } else {
        setTimeout(check, 500, resolve);
      }
    }

    check(rev);
  });
}

function redirectLogFF(page: Page) {
  page.on('console', (consoleObj) => {
    if (consoleObj.text()
      .startsWith('FF ')) {
      console.log(consoleObj.text());
    }
  });
}

async function goToPage(page: Page, url: string) {
  try {
    await page.goto(url, { timeout: 10000 });
  } catch (e) {
    await goToPage(page, url);
  }
}

/*
* Tests for injection_script.ts
*/
const files = fs.readdirSync('../src/bypasses')
  .filter((file) => file.endsWith('.t.ts'));
for (let i = 0; i < files.length; i++) {
  // eslint-disable-next-line global-require
  const f = require(`../src/bypasses/${files[i]}`)
    .default();
  describe(`${f.name} bypass`, () => {
    beforeAll(async () => {
      redirectLogFF(page);
      await page.bringToFront();
      await goToPage(page, f.url);
    }, 30000);
    it(`should go to ${f.to}`, async () => {
      await expect(waitForURL(page, f.to, f.timeout || 10000))
        .resolves
        .toMatch(f.to);
    }, (f.timeout || 10000) * 2);
  });
}

/*
* Tests for rules.json
*/
const json = JSON.parse(fs.readFileSync('../src/rules.json', 'utf8'));
Object.keys(json)
  .forEach((key) => {
    if (Array.isArray(json[key])) {
      json[key].forEach((item) => {
        if (item.url && item.to) {
          describe(`${item.name || item.url} bypass`, () => {
            beforeAll(async () => {
              redirectLogFF(page);
              await page.bringToFront();
              await goToPage(page, item.url);
            }, 30000);
            it(`should go to ${item.to}`, async () => {
              await expect(waitForURL(page, item.to, item.timeout || 10000))
                .resolves
                .toMatch(item.to);
            }, (item.timeout || 10000) * 2);
          });
        }
      });
    }
  });
