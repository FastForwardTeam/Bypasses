import {
  awaitElement, hrefBypass, ifElement, safelyAssign,
} from '../fastforward';

interface CWindow extends Window {
  adblock: boolean;
}

declare let window: CWindow;

// No auto test for this bypass
// Manual test link: https://akwam.to/download/99854/5527/spider-man-no-way-home-1

// Adblock detection
hrefBypass(/akwam\.to/, () => {
  ifElement('#ignielAdBlock', (ele) => {
    ele.remove();
    window.adblock = false;
    document.body.style.overflow = null;
  }, undefined);
  // Bypass
  hrefBypass(/akwam\.to\/download\//, () => {
    console.log('Matched bypass');
    awaitElement('.btn-loader > a', (ele: HTMLAnchorElement) => {
      console.log('Found download button');
      safelyAssign(ele);
    });
  }, true);
});
