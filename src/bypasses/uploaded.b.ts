import { domainBypass } from '../fastforward';

// No auto test for this bypass
domainBypass('uploaded.net', () => {
  let i = 0;
  // @ts-ignore
  window.setTimeout = (f) => {
    if (++i === 62) {
      window.setTimeout = setTimeout;
    }
    return setTimeout(f, 100);
  };
});
