import { hrefBypass, safelyNavigate } from '../fastforward';

// No auto test for this bypass
// Manual test link: https://old.akwam.to/download/16086fa90c99/Yomeddine-2018-1080p-WEB-DL-akoam-net-mkv
hrefBypass(/old\.akwam\.to\/download\/.+\/.+/, () => {
  fetch(window.location.href, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res) => safelyNavigate(res.direct_link));
});
