import { awaitElement, hrefBypass, safelyAssign } from '../fastforward';

hrefBypass(/shortmoz\.link\/.+/, () => {
  awaitElement('a[ref="nofollow"]', (ele:HTMLAnchorElement) => safelyAssign);
});
