import { awaitElement, domainBypass, replaceSetInterval } from '../fastforward';

// No auto test for this bypass
// Because it leads to another bypass
// Manual test: http://bc.vc/vQesLIh
domainBypass(/bc\.vc|bcvc\.live|bcvc\.xyz/, () => {
  replaceSetInterval();
  awaitElement("a#getLink:not([style^='display'])", (a: HTMLButtonElement) => a.click());
});
