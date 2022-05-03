import { awaitElement, hrefBypass } from '../fastforward';

hrefBypass(/ouo\.io\/.+/, () => {
  awaitElement('#btn-main', (btn: HTMLButtonElement) => {
    btn.click();
  });
});
