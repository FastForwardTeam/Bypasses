import { domainBypass, ODP, safelyNavigate } from '../fastforward';

// No auto test for this bypass
// Because it leads to another bypass
// Manual test: https://gamesmega.net/links/l?hs=nUE0pPHmDFHlEvHlEzqiYJkcozgmYz5yqPHlEzkGEN==
domainBypass('gamesmega.net', () => {
  ODP(window, 'hash', {
    get: () => '',
    set: (_: any) => safelyNavigate(decodeURIComponent(window.atob(_))),
  });
});
