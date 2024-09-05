const { populateCollection } = require('./db/createDB');
const { insert } = require('./db/crud/insert/recommender.js');
const {generateNocLevelAnalyzers, generateSiteLevelAnalyzers } = require('./job/GenerateRecommendation.js');

//insert("723", 2);

//a--> [115-->[711,713], 315-->[713,719]]




const generateInsights = async function(){
await generateNocLevelAnalyzers();
await generateSiteLevelAnalyzers();
setInterval(async ()=>{
    await generateNocLevelAnalyzers();
    await generateSiteLevelAnalyzers();
}, 24*60*60*1000);
}




module.exports = {
    generateInsights
}