const BASE_URL = 'https://en.wikipedia.org/wiki/';

const getLink = async (articleUrl, linkOrdinal) => {
  // TODO
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