const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { v4 } = require('uuid');
const prettier = require('prettier');

const addUniqueIdToElements = async (dirPath) => {
  try {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      if (!file.startsWith('.') && file.endsWith('.html')) {
        const filePath = path.join(dirPath, file);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const modifiedContent = await addUniqueIdToElementsInHtml(fileContent);
        await fs.promises.writeFile(filePath, modifiedContent, 'utf-8');
        console.log(`File '${file}' processed and saved.`);
      }
    }

    console.log('All HTML files in the directory have been processed.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const addUniqueIdToElementsInHtml = async (htmlContent) => {
  const $ = cheerio.load(htmlContent);

  $('body > *, body > details > *').each((index, element) => {
    if ([
      'html', 'head', 'style', 'script', 'body', 'title', 'meta', 'link', 'summary', 'li', 'span'
    ].indexOf(element.tagName?.toLowerCase()) >= 0) {
      // skip
    } else {
      const currentId = $(element).attr('id');
      if (!currentId) {
        $(element).attr('id', v4());
      }
    }
  });

  return $.html();
  // return await prettier.format($.html(), { htmlWhitespaceSensitivity: 'ignore', parser: 'html', useTabs: true, quoteProps: 'consistent' });
};

// Replace 'your_directory_path' with the path to your HTML files directory.
const directoryPath = '/Users/nlassonde/spector/TrenchDiffEqHTML';
addUniqueIdToElements(directoryPath);

