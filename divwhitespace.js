const fs = require('fs');
const path = require('path');

const inputDirectory = '/Users/nlassonde/spector/TrenchDiffEqHTML';
const outputDirectory = '/Users/nlassonde/spector/TrenchDiffEqHTML/test';
const cheerio = require('cheerio');
const prettier = require('prettier');

async function processFile(filePath) {
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

	  let modifiedContent = data;
	    modifiedContent = modifiedContent.replace(/<div[^>]*>((?:[^<]|<(?!\/div>))*)<\/div>/gs, (match, divContent) => {
      return match.replace(divContent, divContent.replace(/(\\begin[\s\S]*?\\end)|\s*\n\s*/g, (match, beginEnd) => beginEnd ? match : ' '));
	});
	  
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<div[^>]*>)((?:[^<]|<(?!\/div>))*)\s*(<\/div>)/gs, "$1$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<ol[^>]*>)((?:[^<]|<(?!\/ol>))*)\s*(<\/ol>)/gs, "\n$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<ul[^>]*>)((?:[^<]|<(?!\/ul>))*)\s*(<\/ul>)/gs, "\n$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<li[^>]*>)((?:[^<]|<(?!\/li>))*)\s*(<\/li>)/gs, "\n$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<details[^>]*>)((?:[^<]|<(?!\/details>))*)\s*(<\/details>)/gs, "\n$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)([^\n]*)\\begin([\s\S]*?)\\end/g, "$1$2$3\n$2\\begin $4\n$2\\end");
	const $ = cheerio.load(modifiedContent);
	  
	modifiedContent = await prettier.format($.html(), {printWidth: 10000000, htmlWhitespaceSensitivity: 'strict', parser: 'html', useTabs: true, quoteProps: 'consistent' });
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<div[^>]*>)((?:[^<]|<(?!\/div>))*)\s*(<\/div>)/gs, "$1$2$3\n$2\t$4\n$2$5");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)([^\n]*)\\begin([\s\S]*?)\\end/g, "$1$2$3\n$2\\begin $4\n$2\\end");
	modifiedContent = modifiedContent.replace(/(\n?)([ \t]*)(<span[^>]*>)((?:[^<]|<(?!\/span>))*)\s*(<\/span>)(\n)?([ \t]*)/gs, "$3$4$5");
		

    const outputFilePath = path.join(outputDirectory, path.basename(filePath));
    fs.writeFile(outputFilePath, modifiedContent, err => {
      if (err) {
        console.error(`Error writing file ${outputFilePath}:`, err);
      } else {
        console.log(`File ${outputFilePath} has been modified and saved.`);
      }
    });
  });
}

fs.readdir(inputDirectory, async (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  await Promise.all(files.map(async file => {
    if (file.endsWith('.html')) {
      const inputFilePath = path.join(inputDirectory, file);
      await processFile(inputFilePath);
    }
  }));
});
