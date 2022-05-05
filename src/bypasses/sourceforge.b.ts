import { ensureDomLoaded, hrefBypass, ODP } from '../fastforward';

// No auto test for this bypass
hrefBypass(/sourceforge\.net\/projects\/.+\/files\/.+\/download/, () => {
  const b = document.createElement('button');
  let d = false;
  b.className = 'direct-download';
  b.style.display = 'none';
  document.documentElement.appendChild(b);
  ODP(window, 'log', {
    value: (m: any) => {
      console.log(m);
      if (m === 'triggering downloader:start') {
        d = true;
      }
    },
    writable: false,
  });
  ensureDomLoaded(() => {
    const bT = setInterval(() => {
      if (d) {
        clearInterval(bT);
      } else {
        b.click();
      }
    }, 100);
  });
});
