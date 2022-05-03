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
    const xhr = new XMLHttpRequest();
    xhr.onload = () => safelyNavigate(xhr.responseText);
    xhr.open('POST', 'https://www.shortly.xyz/getlink.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(`id=${window.location.hash.substr(1)}`);
  }
});
