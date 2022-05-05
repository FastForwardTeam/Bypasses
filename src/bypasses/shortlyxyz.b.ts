import { domainBypass, safelyNavigate } from '../fastforward';

domainBypass('shortly.xyz', () => {
  if (window.location.pathname.substr(0, 3) === '/r/') {
    // @ts-ignore
    document.getElementById = () => ({
      submit: () => {
        const f = document.querySelector('form');
        f.action = `/link#${(document.querySelector("input[name='id']") as HTMLInputElement).value}`;
        f.submit();
      },
    });
  } else if (window.location.pathname === '/link') {
    fetch('https://www.shortly.xyz/getlink.php', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      method: 'POST',
      body: new URLSearchParams({
        id: window.location.hash.substr(1),
      }),
    }).then((res) => res.text()).then(safelyNavigate);
  }
});
