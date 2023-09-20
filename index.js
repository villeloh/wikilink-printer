const BASE_URL = 'https://en.wikipedia.org/wiki/';

const wikiRequest = async (articleUrl) => {
  // TODO
}

const getLink = (wikiArticle, ordinal) => {
  // TODO
}

const printLink = (link, indentation) => {
  const spaces = ' '.repeat(indentation)
  console.log(`${spaces}${link}`)
}

const printLinkTree = async (startingArticle, linkDepth = 1, followFirstLinks = 1) => {
  if (!startingArticle || typeof startingArticle !== 'string') {
    console.log('Error! Call printLinkTree() with the url-name of a Wikipedia article.')
    return
  }
  if (typeof linkDepth !== 'number' || typeof followFirstLinks !== 'number') {
    console.log('Error! Arguments after the first one must be numbers.')
    return
  }

  for (let i = 0; i < linkDepth; i++) {

  }


};