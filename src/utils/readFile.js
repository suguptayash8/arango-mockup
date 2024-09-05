const fs = require('fs');
const path = require('path');

const files = ['sites', 'tenants', 'analyzers'];

/*
const sitePath = path.join(__dirname,  `../mock/sites/sites.json`);
const tenantsPath = path.join(__dirname,  `../mock/tenants/tenants.json`);
const analyzersPath = path.join(__dirname,  `../mock/analyzers/analyzers.json`);
*/

const readFile =  function(filePath){
    return fs.readFileSync(filePath, 'utf8');
}


let filePath = function(name){
    return path.join(__dirname,  `../mock/${name}/${name}.json`);
}

const fileData = (function(){
    let fileData = {};
    files.forEach(file=>{
        fileData[file] = loadJsonFile(file);
    });
    return fileData;
})();




function loadJsonFile(name){
      return JSON.parse(readFile(filePath(name)));
}


module.exports = {
    readFile,
    fileData
    
}