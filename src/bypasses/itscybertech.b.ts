import { domainBypass, ensureDomLoaded } from '../fastforward';

// Not a bypass, but remove anti-adblocker warning
domainBypass('itscybertech.com', () => {
  ensureDomLoaded(() => {
    document.querySelector('#antiAdBlock').remove();
  });
});
