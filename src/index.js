const { populateCollection } = require('./db/createDB');
const { insert } = require('./db/crud/insert/recommender.js');
const {generateNocLevelAnalyzers, generateSiteLevelAnalyzers } = require('./job/GenerateRecommendation.js');

//insert("723", 2);

//a--> [115-->[711,713], 315-->[713,719]]

generateNocLevelAnalyzers();
generateSiteLevelAnalyzers();
setInterval(generateNocLevelAnalyzers, 24*60*60*1000);
setInterval(generateSiteLevelAnalyzers, 24*60*60*1000);