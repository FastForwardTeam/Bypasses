import { domainBypass, awaitElement, safelyNavigate } from '../fastforward';

domainBypass('tik.lat', () => {
  // @ts-ignore
  window.setInterval = (f) => setInterval(f, 1);
  awaitElement('.skip > .wait > .skip > .btn > a[href]', safelyNavigate);
});
