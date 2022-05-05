import { domainBypass, ifElement, safelyNavigate } from '../fastforward';

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const _sharedData: any;
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
declare const ___reactjsD: any;
declare const window: any;

domainBypass('adshrink.it', () => {
  ifElement("meta[property='og:site_name'][content='Adshrink.it']", () => {
    const iT = setInterval(() => {
      if (typeof _sharedData === 'object' && 0 in _sharedData && 'destination' in _sharedData[0]) {
        clearInterval(iT);
        const txt = document.createElement('textarea');
        txt.innerHTML = _sharedData[0].destination;
        safelyNavigate(txt.value);
      } else if (typeof ___reactjsD !== 'undefined' && typeof window[___reactjsD.o] === 'object' && typeof window[___reactjsD.o].dest === 'string') {
        clearInterval(iT);
        safelyNavigate(window[___reactjsD.o].dest);
      }
    });
  });
});
