import { ensureDomLoaded, hrefBypass, safelyAssign } from '../fastforward';

// There is also a adfoc.us bypass in rules.json, however it requires a url tag which is not always present
hrefBypass(/adfoc\.us\/serve\/.*\?id=/, () => {
  ensureDomLoaded(() => {
    safelyAssign(document.querySelector('#showSkip > a') as HTMLAnchorElement);
  });
});
