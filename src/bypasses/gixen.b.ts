import { hrefBypass } from '../fastforward';

// No auto test for this bypass
// Because it requires an account
hrefBypass(/gixen\.com\/home_1\.php/, () => {
  const sid = document.cookie.match(/sessionid=(\d+)/)[1];
  if (sid) {
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = `home_2.php?sessionid=${sid}`;
    f.innerHTML = '<input type="hidden" name="gixenlinkcontinue" value="1">';
    document.documentElement.appendChild(f);
    // @ts-ignore
    countIt(() => f.submit());
  }
});
