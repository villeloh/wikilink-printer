import axios from 'axios';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://en.wikipedia.org/wiki/';
const DEFAULT_INDENT_ADD = 2;

// to avoid excessive requests (if we had a server running and not just a single file)
const linkCache = {};

// links contained in sidebars, image captions, etc are against the spirit of the challenge
const filterNonBodyElements = (linkElements) => {
  if (!linkElements) return null
  
  return Array.from(linkElements).filter(linkEl => {
    const link = linkEl.getAttribute('href');
    const exclusions = [
        '(disambiguation)',
        '.jpg',
        'File:',
        'Wikipedia:',
        '#cite',
        'Help:',
    ];
    const parentElements = [
        linkEl.closest('figcaption'),
        linkEl.closest('table'),
        linkEl.closest('.sidebar-caption'),
        linkEl.closest('li'),
        linkEl.closest('.mbox-text-span'),
        linkEl.closest('.hatnote'),
    ];
    return !exclusions.some(exclusion => link?.includes(exclusion)) 
    && !parentElements.some(parent => !!parent);
  });
};

const getWikiLink = async (articleUrl, linkIndex) => {
  try {
    let linkElements;

    // Check if article is already in cache
    if (linkCache[articleUrl]) {
      linkElements = linkCache[articleUrl];
    } else {
      const url = `${BASE_URL}${articleUrl}`;
      const { data } = await axios.get(url);

      // simulate DOM in Node.js
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
    const cleanedLink = link?.startsWith('/wiki/') ? link.substring(6) : link;
    return cleanedLink;
  } catch (error) {
    console.error(`Failed to fetch Wiki article: ${error}`)
    return null;
  }
};

const printLink = (link, indentation) => {
  const spaces = ' '.repeat(indentation);
  console.log(`${spaces}${link}`);
};

const parseNumericString = (arg) => {
  const num = parseInt(arg);
  return isNaN(num) ? arg : num;
};

const verifyNumbers = (...args) => {
  return args.every(arg => typeof arg === 'number');
};

let firstCall = true;
const printLinkTree = async (articleUrl, linkDepth = 1, linkBreadth = 1, indentation) => {
  if (firstCall) {
    // we always start the printout from the left edge
    indentation = 0;
    firstCall = false;
  }
  if (!articleUrl || typeof articleUrl !== 'string') {
    console.error('Error! Call printLinkTree() with the url-name of a Wikipedia article.');
    return;
  }
  if (!verifyNumbers(linkDepth, linkBreadth, indentation)) {
    console.error('Error! Arguments after the first one must be numbers.');
    return;
  }
  printLink(articleUrl, indentation);
  
  if (linkDepth <= 0) return;

  for (let i = 0; i < linkBreadth; i++) {
    const wikiArticle = await getWikiLink(articleUrl, i);

    if (wikiArticle) { 
      await printLinkTree(wikiArticle, linkDepth - 1, linkBreadth, indentation + indentAddition);
     } else { 
      break; 
    }
  }
};

// parse command line arguments
const articleName = process.argv[2];
let numArgs = process.argv.slice(3);
numArgs = numArgs.map((arg) => parseNumericString(arg)); // console arguments are always strings
const indentAddition = numArgs && numArgs.length === 3 ? numArgs[2] : DEFAULT_INDENT_ADD;

if (numArgs.length + 1 <= 4) {
  printLinkTree(articleName, ...numArgs);
} else {
  console.error('Error! Called printLinkTree() with too many arguments (> 4)!');
}
