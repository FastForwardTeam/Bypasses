import { domainBypass, ensureDomLoaded, safelyNavigate } from '../fastforward';

domainBypass('tei.ai', () => {
  ensureDomLoaded(() => {
    const link = window.atob(`aH${(document.querySelector("#link-view [name='token']") as HTMLInputElement).value.split('aH').slice(1).join('aH')}`);
    safelyNavigate(link);
  });
});
