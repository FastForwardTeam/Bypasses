const pathToExtension = require('path')
  .join(__dirname, `extension-${process.env.PLATFORM}`);

const launchOptions = {
  dumpio: true,
  headless: false,
  product: process.env.PLATFORM === 'chromium' ? 'chrome' : 'firefox',
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`,
  ],
};

if (process.env.PUPPETEER_EXEC_PATH) {
  launchOptions.executablePath = process.env.PUPPETEER_EXEC_PATH;
  launchOptions.args = [...launchOptions.args, '--no-sandbox'];
}

module.exports = {
  launch: launchOptions,
  browserContext: 'default',
};
