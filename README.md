# FastForward Bypasses

This is a collection of bypass for [FastForward](https://github.com/FastForwardTeam/FastForward)

### How to add a bypass? 
1. Install the dependencies with `npm i`
2. Go to the folder `src/bypass`
3. Create a new file with the name of the bypass (The name must end with `.b.ts`)
4. Add your own bypass in the file
5. (Optional) Create a new file for auto testing (The name must end with `.t.ts`)
6. Run `npm run build`
7. Copy the `dist/bundle.js` file to extension's `src/js/` folder and rename the file to `injection_script.js`
8. Copy the `dist/rules.json` file to extension's `src/js/` folder

### How to run auto testing?
1. Go to the folder `tests`
2. Install the dependencies with `npm i`
3. Run `npm run test:chromium`

### There is an error!
Please report the error to [FastForward](https://discord.com/invite/RSAf7b5njt)
