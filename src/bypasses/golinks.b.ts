import { awaitElement, hrefBypass, safelyAssign } from '../fastforward';

hrefBypass(/go-links\.net\/.+/, () => {
  awaitElement('a[target="_blank"]', (ele:HTMLAnchorElement) => safelyAssign);
});
