import axios from 'axios';

const BASE_URL = 'https://en.wikipedia.org/w/api.php?';

// to avoid excessive requests
const cache = {};

const getLink = async (articleUrl, linkIndex) => {
  try {
    let extract;

    // Check if article is already in cache
    if (cache[articleUrl]) {
      extract = cache[articleUrl];
    } else {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: articleUrl,
        prop: 'extracts',
        exintro: 'true'
      });

      const { data } = await axios.get(`${BASE_URL}${params.toString()}`, {
        headers: { 'Api-User-Agent': 'Ville_L' }
      });
      const pages = data?.query?.pages;
      if (!pages) return null;
      const firstPage = Object.values(pages)[0];
      extract = firstPage?.extract;
      
      cache[articleUrl] = extract;
    }

    const dom = new DOMParser();
    const document = dom.parseFromString(extract, 'text/html');
    const links = document.querySelectorAll('a');

    if (links.length === 0 || linkIndex >= links.length) return null;
    const linkElement = links[linkIndex];
    
    // handle relative and top-level links
    return linkElement.getAttribute('href')?.startsWith('/') ?
      `https://en.wikipedia.org${linkElement.getAttribute('href')}` : 
      linkElement.getAttribute('href');
  } catch (error) {
    console.error(`Failed to fetch article: ${error}`)
    return null
  }
};

const printLink = (link, indentation) => {
  const spaces = '  '.repeat(indentation);
  console.log(`${spaces}${link}`);
};

const printLinkTree = async (articleUrl, linkDepth = 1, followLinks = 1, indentation = 0) => {
  if (!articleUrl || typeof articleUrl !== 'string') {
    console.log('Error! Call printLinkTree() with the url-name of a Wikipedia article.');
    return;
  }
  if (typeof linkDepth !== 'number' || typeof followLinks !== 'number') {
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
