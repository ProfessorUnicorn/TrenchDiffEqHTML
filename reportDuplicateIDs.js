const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directoryPath = '/Users/nlassonde/spector/TrenchDiffEqHTML';


function processFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(fileContents);

	const idMap = {};

    $('[id]').each((index, element) => {
        const id = $(element).attr('id');
        if (idMap[id]) {
            idMap[id].push(true);
        } else {
            idMap[id] = [true];
        }
	});
	
	reportDuplicates(filePath, idMap);
}

function reportDuplicates(filePath, idMap) {
	let firstDupe = true;
    for (const id in idMap) {
		if (idMap[id].length > 1) {
			if (firstDupe) {
				console.log(`In ${filePath}:`)
				firstDupe = false;
			}

            console.log(`${idMap[id].length} times - ID: ${id}`);
        }
	}
	
	if (!firstDupe) {
		console.log('---');
		console.log('');
	}
}

function processDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && path.extname(file) === '.html') {
            processFile(filePath);
        }
    });
}

processDirectory(directoryPath);
