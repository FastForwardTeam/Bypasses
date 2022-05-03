/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  preset: './jest.preset.js',
  globalSetup: './jest.setup.js',
};
