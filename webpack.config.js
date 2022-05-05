const glob = require('glob');
const path = require('path');
const fs = require('fs');
const {Compilation} = require('webpack');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: ['./src/fastforward.ts', ...glob.sync('./src/bypasses/*.b.ts')],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.compilation.tap('CompilationPlugin', (compilation, cb) => {
          // Custom plugin to remove the () => {} wrapper from the generated code
          compilation.hooks.processAssets.tap({
            name: 'ProcessAssetsPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          }, (assets) => {
            /* eslint-disable no-underscore-dangle */
            assets['bundle.js']._value = assets['bundle.js']._value.substr(6, assets['bundle.js']._value.length - 11);
            assets['bundle.js']._valueAsString = assets['bundle.js']._valueAsString.substr(6, assets['bundle.js']._valueAsString.length - 11);
            /* eslint-enable no-underscore-dangle */
          });
          // Add rules.json to the bundle
          compilation.hooks.processAssets.tap({
            name: 'ProcessAssetsPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          }, (assets) => {
            const json = JSON.parse(fs.readFileSync('./src/rules.json', 'utf8'));
            Object.keys(json)
              .forEach((key) => {
                if (Array.isArray(json[key])) {
                  if (json[key].length === 0) {
                    delete json[key];
                  } else {
                    json[key] = json[key].map((item) => item.regex || item);
                  }
                }
              });
            const jsonStr = JSON.stringify(json);
            assets['rules.json'] = {
              source: () => jsonStr,
              size: () => jsonStr.length,
            };
          });
        });
      },
    },
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    mangleExports: false,
    removeEmptyChunks: false,
    usedExports: false,
  },
};
