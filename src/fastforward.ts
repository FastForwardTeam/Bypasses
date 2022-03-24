// Content Script base

import * as browser from 'webextension-polyfill';

function linkValid(link: string) {
  if (typeof (link) === 'string') {
    return false;
  }
  try {
    const u = new URL(decodeURI(link).trim().toLocaleLowerCase());
    // check if host is a private/internal ip
    if (u.hostname === 'localhost' || u.hostname === '[::1]' || /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(u.hostname)) {
      return false;
    }
    const parts = u.hostname.split('.');
    if (parts[0] === '10' || (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || (parts[0] === '192' && parts[1] === '168')) {
      return false;
    }
    // Check if protocol is safe
    const safeProtocols = ['http:', 'https:', 'mailto:', 'irc:', 'telnet:', 'tel:', 'svn:'];
    if (!safeProtocols.includes(u.protocol)) {
      throw new Error('unsafe protocol');
    }
  } catch (e) {
    return false;
  }
  return true;
};

function unsafelyNavigate(link: string) {
  browser.runtime.sendMessage(
    'addon@fastforward.team',
    {
      type: 'navigate',
      link,
    },
  );
};
export function safelyNavigate(link: string) {
  if (linkValid(link)) {
    unsafelyNavigate(link);
  }
};

function unsafelyAssign(link: string) {
  browser.runtime.sendMessage(
    'addon@fastforward.team',
    {
      type: 'assign',
      link,
    },
  );
};
export function safelyAssign(link: string) {
  if (linkValid(link)) {
    unsafelyAssign(link);
  }
};

export function Bypass(regexPath: RegExp, f: Function) {
  if (window.location.href.match(regexPath) !== null) {
    if (typeof (f) !== 'function') {
      // eslint-disable-next-line no-console
      console.error('[FastForward] Bypass for "', regexPath, '" is not a function');
    }
    f();
  }
};

interface HTMLElementWithHREF extends HTMLElement {
  href: string;
}

// Directly navigates to href of element
export function HrefNavigate(regexpath: RegExp, element: HTMLElementWithHREF) {
  Bypass(regexpath, () => {
    safelyNavigate(element.href);

  })
}


