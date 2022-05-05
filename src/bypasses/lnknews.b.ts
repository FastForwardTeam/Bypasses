import { domainBypass, ifElement, safelyNavigate } from '../fastforward';

// No auto test for this bypass
// Because it has Google captcha to solve
// Manual test: https://lnk.news/go/2jaR9
domainBypass('lnk.news', () => ifElement('#display_go_form', (f) => {
  // @ts-ignore
  window.open = () => {};
}, () => ifElement('#skip_form', () => {
  safelyNavigate(document.body.textContent.match(/goToUrl.*\(.*['"](.+)['"].*\)/)[1]);
})));
