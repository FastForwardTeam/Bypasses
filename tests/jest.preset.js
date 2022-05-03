// Configuration with https://datacadamia.com/web/javascript/jest_puppeteer

const tsPresent = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = Object.assign(tsPresent, puppeteerPreset);
