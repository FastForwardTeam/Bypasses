const path = require("path");
const fs = require("fs");

const extensionDIR = path.join(__dirname, `extension-${process.env.PLATFORM}`);
const distDir = path.resolve(__dirname, '..', 'dist');
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
