import axios from 'axios';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://en.wikipedia.org/wiki/';

// to avoid excessive requests (if we had a server and not just a single file to run)
const linkCache = {};

const filterNonBodyElements = (linkElements) => {
  if (!linkElements) return null
  
return Array.from(linkElements).filter(linkEl => {
    const link = linkEl.getAttribute('href');
    const exclusions = [
        '(disambiguation)',
        '.jpg',
        'File:',
        'Wikipedia:',
        '#cite'
    ];
    const parentElements = [
        linkEl.closest('figcaption'),
        linkEl.closest('table'),
        linkEl.closest('.sidebar-caption'),
        linkEl.closest('li'),
        linkEl.closest('.mbox-text-span'),
        linkEl.closest('.hatnote')
    ];
    return !exclusions.some(exclusion => link?.includes(exclusion)) 
    && !parentElements.some(parent => !!parent);
});
}

const getLink = async (articleUrl, linkIndex) => {
  try {
    let linkElements;

    // Check if article is already in cache
    if (linkCache[articleUrl]) {
      linkElements = linkCache[articleUrl];
    } else {
      const url = `${BASE_URL}${articleUrl}`;
      const { data } = await axios.get(url);

      const dom = new JSDOM(data);
      const document = dom.window.document;
      const contentDiv = document.querySelector('#mw-content-text'); // Select only the main content
      linkElements = filterNonBodyElements(contentDiv?.querySelectorAll('a'));

      linkCache[articleUrl] = linkElements;
    }
    if (!linkElements || linkElements.length === 0 || linkIndex >= linkElements.length) return null;
    
    const linkElement = linkElements[linkIndex];
    const link = linkElement.getAttribute('href');

    // the returned links contain an extra '/wiki/' for some reason
    const cleanedLink = link?.startsWith('/wiki/') ? link.substring(6) : link
    return cleanedLink;
  } catch (error) {
    console.error(`Failed to fetch article: ${error}`)
    return null;
  }
};

const printLink = (link, indentation) => {
  const spaces = '  '.repeat(indentation);
  console.log(`${spaces}${link}`);
};

const verifyNumbers = (...args) => {
  return args.every(arg => typeof arg === 'number');
}

const printLinkTree = async (articleUrl, linkDepth = 1, followLinks = 1, indentation = 0) => {
  if (!articleUrl || typeof articleUrl !== 'string') {
    console.log('Error! Call printLinkTree() with the url-name of a Wikipedia article.');
    return;
  }
  if (!verifyNumbers(linkDepth, followLinks, indentation)) {
    console.log('Error! Arguments after the first one must be numbers.');
    return;
  }
  printLink(articleUrl, indentation);
  if (linkDepth <= 0) return;

  for (let i = 0; i < followLinks; i++) {
    const wikiArticle = await getLink(articleUrl, i);

    if (wikiArticle) { 
      await printLinkTree(wikiArticle, linkDepth - 1, followLinks, indentation + 1);
     } else { 
      break; 
    }
  }
};

printLinkTree('Light', 2, 3);
