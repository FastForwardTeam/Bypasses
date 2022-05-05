import {
  crowdBypass, domainBypass, ensureDomLoaded, ifElement,
} from '../fastforward';

// Testing handle by rules.json
domainBypass(/ouo\.(press|io)/, () => {
  ensureDomLoaded(() => {
    if (window.location.pathname !== '/') {
      if (/(go|fbc)/.test(window.location.pathname.split('/')[1])) {
        document.querySelector('form')
          .submit();
      } else {
        ifElement('form#form-captcha', (form: HTMLFormElement) => {
          form.action = `/xreallcygo${window.location.pathname}`;
          form.submit();
        }, () => crowdBypass());
      }
    }
  });
});
