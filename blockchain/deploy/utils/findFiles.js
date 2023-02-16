const fs = require('fs');
const path = require('path');

function findJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json') && !file.includes('dbg')) {
      fileList.push({
        path: path.relative(process.cwd(), path.dirname(filePath)) + '\\',
        name: file,
      });
    }
  });

  return fileList;
}

const jsonFiles = findJsonFiles('./artifacts/contracts');
console.log(jsonFiles);
