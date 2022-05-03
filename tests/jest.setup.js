const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

const simpleGit = require('simple-git');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async (globalConfig) => {
  const extensionDIR = path.join(__dirname, `extension-${process.env.PLATFORM}`);

  if (process.env.PLATFORM === undefined) {
    console.log('Please set the PLATFORM environment variable to either "chromium" or "firefox"');
    process.exit(1);
  }

  const distDir = path.resolve(__dirname, '..', 'dist');
  if (fs.existsSync(extensionDIR)) {
    console.log('Extension built.');
  } else {
    console.log('Building extension...');
    const git = simpleGit();
    await git.clone('https://github.com/FastForwardTeam/FastForward', 'build');
    await execSync('chmod -R +x scripts', { cwd: 'build' });
    // Remove zip command when building in GH actions
    if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD) {
      const scriptDir = path.resolve(__dirname, 'build', 'scripts');
      fs.readdirSync(scriptDir).forEach((file) => {
        if (file.endsWith('.sh')) {
          const content = fs.readFileSync(path.resolve(scriptDir, file), 'utf8');
          if (content.includes('zip')) {
            fs.writeFileSync(path.resolve(scriptDir, file), content.replace(/ +zip.+/g, ''));
          }
        }
      });
    }
    await execSync(`./scripts/${process.env.PLATFORM}.sh`, { cwd: 'build' });
    fs.cpSync(path.resolve(__dirname, 'build', 'build', `FastForward.${process.env.PLATFORM}`), extensionDIR, { recursive: true });
    console.log('Extension built.');
  }

  /*
  * Update bypasses
  * */
  const rulesJSON = path.resolve(distDir, 'rules.json');
  if (fs.existsSync(rulesJSON)) {
    fs.copyFileSync(rulesJSON, path.resolve(extensionDIR, 'rules.json'));
    console.log('Updated rules.json');
  }
  const injectionScript = path.resolve(distDir, 'bundle.js');
  if (fs.existsSync(injectionScript)) {
    fs.copyFileSync(injectionScript, path.resolve(extensionDIR, 'injection_script.js'));
    console.log('Updated injection_script.js');
  }

  await setupPuppeteer(globalConfig);
};
