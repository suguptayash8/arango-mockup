const fs = require('fs');
const path = require('path');

const readFile =  function(filePath){
    return fs.readFileSync(filePath, 'utf8');
}

module.exports = {
    readFile
}