import { Page } from 'puppeteer';
import fs from 'fs';

function waitForURL(page: Page, url: string, timeout: number) {
  return new Promise<string>((rev) => {
    let count = 0;

    function check(resolve: (value: (string | PromiseLike<string>)) => void) {
      const pageURL = page.url();
      if (pageURL === url) {
        resolve(pageURL);
      } else if (count++ > timeout / 100) {
        resolve(pageURL);
      } else {
        setTimeout(check, 100, resolve);
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

function addTest(name: string, url: string, to: string, timeout: number = 10000) {
  describe(`${name} bypass`, () => {
    beforeAll(async () => {
      await jestPuppeteer.resetPage();
      redirectLogFF(page);
      await page.bringToFront();
      await goToPage(page, url);
    }, 30000);
    it(`should go to ${to}`, async () => {
      await expect(waitForURL(page, to, 10000))
        .resolves
        .toMatch(to);
    }, (timeout || 10000) * 2);
  });
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
  addTest(f.name, f.url, f.to, f.timeout);
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
          addTest(item.name, item.url, item.to, item.timeout);
        }
      });
    }
  });
