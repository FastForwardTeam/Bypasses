// Content Script base
// Boolean values to be changed in context
let navigated: boolean = false;
let bypassed: boolean = false;
const isGoodLinkAllowSelf: boolean = false;

// Settings to be replaced before execution
const crowdEnabled: boolean = false;
const ignoreCrowdBypass: boolean = false;

export function ODP(t: object, p: string, o: any) {
  try {
    Object.defineProperty(t, p, o);
  } catch (e) {
    console.trace("[FastForward] Couldn't define", p);
  }
}

function docSetAttribute(..._args: string[]) {
  document.documentElement.setAttribute.bind(document.documentElement);
}

function isGoodLink(link: any) {
  if (typeof link !== 'string' || (link.split('#')[0] === window.location.href.split('#')[0] && !isGoodLinkAllowSelf)) {
    return false;
  }
  try {
    const u = new URL(decodeURI(link)
      .trim()
      .toLocaleLowerCase());
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
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
}

function parseTarget(target: HTMLAnchorElement | string): string {
  return target instanceof HTMLAnchorElement ? target.href : target;
}

function unsafelyAssign(link: string) {
  navigated = true;
  window.onbeforeunload = null;
  window.location.assign(link);
}

export function unsafelyAssignWithReferer(target: string, referer: string) {
  // The background script will intercept this request and handle it.
  window.location.href = `https://universal-bypass.org/navigate?target=${encodeURIComponent(target)}&referer=${encodeURIComponent(referer)}`;
}

export function safelyAssign(link: HTMLAnchorElement | string, drophash: boolean = true): boolean {
  link = parseTarget(link);
  if (navigated || !isGoodLink(link)) {
    return false;
  }
  bypassed = true;
  const url = new URL(link);
  if (!drophash && (!url || !url.hash)) {
    link += window.location.hash;
  }
  unsafelyAssign(link);
  return true;
}

export function unsafelyNavigate(link: string, referer?: string) {
  if (navigated) {
    return;
  }

  // The background script will intercept the request and redirect to html/before-navigate.html or to the target depending on the user's settings.
  let url = `https://universal-bypass.org/bypassed?target=${encodeURIComponent(link)}&referer=${encodeURIComponent(referer)}`;
  switch (link) { // All values here have been tested using "Take me to destinations after 0 seconds."
    case (/(krnl\.ca|hugegames\.io)/.exec(link) || {}).input:
      url += '&safe_in=15';
      break;
    default:
      break;
  }
  unsafelyAssign(url);
}

export function safelyNavigate(link: string, drophash: boolean = true) {
  link = parseTarget(link);
  if (navigated || !isGoodLink(link)) {
    return false;
  }
  bypassed = true;
  const url = new URL(link);
  if (!drophash && (!url || !url.hash)) {
    link += window.location.hash;
  }
  unsafelyNavigate(link);
  return true;
}

function finish() {
  bypassed = true;
  docSetAttribute('{{channel.stop_watching}}', '');
}

function countIt(f: Function) {
  docSetAttribute('{{channel.count_it}}', '');
  setTimeout(f, 10);
}

function keepLooking(f: Function) {
  bypassed = false;
  f();
}

export function domainBypass(domain: string | RegExp, f: Function) {
  if (bypassed) {
    return;
  }

  if (typeof f !== 'function') {
    alert(`FastForward: Bypass for ${domain} is not a function`);
  }

  if (typeof domain === 'string') {
    if (window.location.hostname === domain || window.location.hostname.substr(window.location.hostname.length - (domain.length + 1)) === `.${domain}`) {
      bypassed = true;
      f();
    }
  } else if ('test' in domain) {
    if (domain.test(window.location.hostname)) {
      bypassed = true;
      f();
    }
  } else {
    console.error('[FastForward] Invalid domain:', domain);
  }
}

export function hrefBypass(regex: RegExp, f: Function) {
  if (bypassed) {
    return;
  }

  if (typeof f !== 'function') {
    alert(`FastForward: Bypass for ${regex} is not a function`);
  }

  const res = regex.exec(window.location.href);
  if (res) {
    bypassed = true;
    f();
  }
}

export function ensureDomLoaded(f: Function, ifNotBypassed: boolean = true) {
  if (!ifNotBypassed && bypassed) {
    return;
  }
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    f();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(f, 1);
    });
  }
}

function insertInfoBox(text: string) {
  ensureDomLoaded(() => {
    const div = document.createElement('div');
    div.innerHTML = '<img src="{{icon/48.png}}" style="width:24px;height:24px;margin-right:8px"><span style="display:inline"></span>';
    div.setAttribute('style', 'z-index:999999;position:fixed;bottom:20px;right:20px;margin-left:20px;background:#eee;border-radius:10px;padding:20px;color:#111;font-size:21px;box-shadow:#111 0px 5px 40px;max-width:500px;font-family:-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol;line-height:normal;cursor:pointer');
    div.setAttribute('tabindex', '-1');
    div.setAttribute('aria-hidden', 'true');
    const span = div.querySelector('span');
    span.textContent = text;
    div.onclick = () => document.body.removeChild(div);
    document.body.appendChild(div);
  });
}

export function ifElement(querySelector: string, func: Function, elseFunc?: Function) {
  ensureDomLoaded(() => {
    const e = document.querySelector(querySelector);
    if (e) {
      func(e);
    } else if (elseFunc) {
      elseFunc();
    }
  });
}

export function awaitElement(querySelector: string, func: Function) {
  ensureDomLoaded(() => {
    const t = setInterval(() => {
      const e = document.querySelector(querySelector);
      if (e) {
        func(e);
        clearInterval(t);
      }
    }, 10);
    setInterval(() => clearInterval(t), 30000);
  });
}

function crowdDomain(d: string) {
  if (crowdEnabled && d) {
    docSetAttribute('{{channel.crowd_domain}}', d);
  }
}

function crowdPath(p: string) {
  if (crowdEnabled && p) {
    docSetAttribute('{{channel.crowd_path}}', p);
  }
}

function crowdReferer(r: string) {
  if (r) {
    docSetAttribute('{{channel.crowd_referer}}', r);
  }
}

function crowdBypass(f?: Function, a: boolean = false) {
  if (!f) {
    f = () => {
    };
  }

  if (crowdEnabled) {
    if (ignoreCrowdBypass) {
      f();
    } else {
      docSetAttribute('{{channel.crowd_query}}', '');
      const iT = setInterval(() => {
        if (document.documentElement.hasAttribute('{{channel.crowd_queried}}')) {
          clearInterval(iT);
          document.documentElement.removeAttribute('{{channel.crowd_queried}}}');
          insertInfoBox('{{msg.crowdWait}}');
          f();
        }
      }, 20);
    }
  } else if (a) {
    f();
  } else {
    insertInfoBox('{{msg.crowdDisabled}}');
  }
}

function crowdContribute(target: string, f: Function) {
  if (typeof f !== 'function') {
    f = () => {
    };
  }

  if (crowdEnabled && isGoodLink(target)) {
    docSetAttribute('{{channel.crowd_contribute}}', target);
    setTimeout(f, 10);
  } else {
    f();
  }
}

function contributeAndNavigate(target: string) {
  if (!navigated && isGoodLink(target)) {
    crowdContribute(target, () => unsafelyNavigate(target));
  }
}

function backgroundScriptBypassClipboard(c: string) {
  if (c) {
    docSetAttribute('{{channel.bypass_clipboard}}', c);
  }
}

function persistHash(h: string) {
  ensureDomLoaded(() => {
    document.querySelectorAll('form[action]')
      .forEach((e: HTMLFormElement) => e.action += `#${h}`);
    document.querySelectorAll('a[href]')
      .forEach((e: HTMLAnchorElement) => e.href += `#${h}`);
  });
}

// decodes https://stackoverflow.com/a/16435373/17117909
function decodeURIEncodedMod(s: string) {
  try {
    return decodeURIComponent(s.replace(/%2D/g, '-')
      .replace(/%5F/g, '_')
      .replace(/%2E/g, '.')
      .replace(/%21/g, '!')
      .replace(/%7E/g, '~')
      .replace(/%2A/g, '*')
      .replace(/%27/g, "'")
      .replace(/%28/g, '(')
      .replace(/%29/g, ')'));
  } catch (e) {
    return null;
  }
}
