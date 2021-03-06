import { browser } from 'webextension-polyfill-ts';

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Loads sites in new background tabs
 * @param text Text containing one URL per line
 * @param lazyloading Lazy-load tabs
 * @param random Open tabs in random order
 */
export function loadSites(
  text: string,
  lazyloading: boolean,
  random: boolean
): void {
  const urlschemes = ['http', 'https', 'file', 'view-source'];
  let urls = text.split(/\r\n?|\n/g);

  if (random) {
    urls = shuffle(urls);
  }

  for (let i = 0; i < urls.length; i++) {
    let theurl = urls[i].trim();
    if (theurl !== '') {
      if (urlschemes.indexOf(theurl.split(':')[0]) === -1) {
        theurl = 'http://' + theurl;
      }
      if (
        lazyloading &&
        theurl.split(':')[0] !== 'view-source' &&
        theurl.split(':')[0] !== 'file'
      ) {
        browser.tabs.create({
          url: browser.extension.getURL('lazyloading.html#') + theurl,
          active: false,
        });
      } else {
        browser.tabs.create({
          url: theurl,
          active: false,
        });
      }
    }
  }
}
