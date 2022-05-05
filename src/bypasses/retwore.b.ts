import { awaitElement, hrefBypass, safelyAssign } from '../fastforward';

hrefBypass(/re\.two\.re\/link\//, () => {
  awaitElement('.download-link', (ele:HTMLAnchorElement) => safelyAssign);
});
