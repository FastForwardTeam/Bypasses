import {
  awaitElement, domainBypass, replaceSetInterval, safelyAssign,
} from '../fastforward';

domainBypass('tik.lat', () => {
  replaceSetInterval();

  awaitElement('.skip > .wait > .skip > .btn > a[href]', (el: HTMLAnchorElement) => {
    safelyAssign(el);
  });
});
