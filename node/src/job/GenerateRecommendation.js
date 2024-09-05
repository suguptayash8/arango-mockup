const {fileData} = require('../utils/readFile.js');
const { generateRandomNumber } = require('../utils/randomeNumber.js');
const {readFile} = require('../utils/readFile.js');
const {populateCollection}  = require('../db/createDB.js');
const path = require('path');

const {sites, tenants, analyzers} = fileData;

const loadIntialData = (function(){
    let tenantSiteMap = {}
    

    let siteIds = sites.slice(0, 50);
    let tenantIds = tenants.slice(0,10);

    tenantIds.forEach(id => {
        tenantSiteMap[id] = siteIds;
    });


    let getInitialData = function(){
        return tenantSiteMap;
    }

    return getInitialData;
})();


let generateSiteLevelAnalyzers = async function(){

    for(let analyzer of analyzers){
        const tenantSitedata = loadIntialData();
        for(let tid of Object.keys(tenantSitedata)){
            let recommenderPath;
            let recommenderObjs;

            try{
                recommenderPath = path.join(__dirname,  `../optimizers/recommender${analyzer}.json`);
                recommenderObjs = JSON.parse(readFile(recommenderPath));
            }catch(e){
                console.error(`analyzer ${analyzer} not present, reason ${e}`);
                return;
            }

            let sharedAttr = getShardAttr(tid);
            let _key = `${sharedAttr}:${generateRandomNumber(7000000000,7999999999)}`;
            let _id = `aiops_optimizer/${_key}`;

            for(let siteId of tenantSitedata[tid]){
                let analyzer_id = `${tid}_${siteId}_${analyzer}_39751_0_${recommenderObjs.created}` ;

                let override = {
                    "_key": _key,
                    "_id":_id,
                    "analyzer_id":analyzer_id,
                    "site_id":siteId,
                    "tenant_id":tid,
                    "timestamp":Date.now(),
                    "shard_attr":sharedAttr
                }

                let mockRecomData = {...recommenderObjs, ...override};

                updateSiteLevelRecommender(mockRecomData, siteId, `name-${siteId}` );

                try{
                    await populateCollection(mockRecomData);
                }catch(e){
        
                }
            }
        }
    }
}

let generateNocLevelAnalyzers = async function(){

    for(const analyzer of analyzers){
        const tenantSitedata = loadIntialData();

        for(const tid of Object.keys(tenantSitedata)){
            let siteId = "-1";
            let recommenderPath; 
            let recommenderObjs;

            try{
                recommenderPath = path.join(__dirname,  `../optimizers/recommender${analyzer}.json`);
                recommenderObjs = JSON.parse(readFile(recommenderPath));
            }catch(e){
                console.error(`analyzer ${analyzer} not present, reason ${e}`);
                return;
            }
            let sharedAttr = getShardAttr(tid);
            let _key = `${sharedAttr}:${generateRandomNumber(7000000000,7999999999)}`;
            let _id = `aiops_optimizer/${_key}`;
            let analyzer_id = `${tid}_${siteId}_${analyzer}_39751_0_${recommenderObjs.created}` ;
            let override = {
                "_key": _key,
                "_id":_id,
                "analyzer_id":analyzer_id,
                "site_id":"-1",
                "tenant_id":tid,
                "timestamp":Date.now(),
                "shard_attr":sharedAttr
            }

            let mockRecomData = {...recommenderObjs, ...override};
            mockRecomData = updateNocLevelRecommender(mockRecomData, tenantSitedata[tid]);

            try{
                await populateCollection(mockRecomData);
            }catch(e){
    
            }
        }
    }
}

let updateSiteLevelRecommender = function(obj, siteId, siteName, isUpdateRequired = false)
{
    for (var k in obj)
    {
        if (typeof obj[k] == "object" && obj[k] !== null){
            if(siteId !== '-1' && (k.includes('impacted_sites') || k.includes('impacted_devices_per_site') || k.includes('impacted_clients_per_site'))){
                updateSiteLevelRecommender(obj[k], siteId, siteName, isUpdateRequired = true);
            }else{
                updateSiteLevelRecommender(obj[k], siteId, siteName, isUpdateRequired);
            }
        }else if(isUpdateRequired) {
            if(k.includes('site_id')){
                obj[k] = siteId;
            }else if(k.includes('name')){
                obj[k] = siteName;
            }else if(k.includes('count')){
                obj[k] = 8;
            }
        }
    }
}

let updateNocLevelRecommender = function(obj, siteIds)
{
    for (var k in obj)
    {
        if (typeof obj[k] == "object" && obj[k] !== null){
            if(k.includes('impacted_sites')){
                let impactedSites =[];
                siteIds.forEach(siteId=>{
                    impactedSites.push({
                        'name': `name-${siteId}`,
                        'site_id': siteId
                    })
                });
                obj[k] = impactedSites;
            }else if(k.includes('impacted_devices_per_site')){
                let impacteimpactedDevicesPerSites =[];
                siteIds.forEach(siteId=>{
                    impacteimpactedDevicesPerSites.push({
                        'name': `name-${siteId}`,
                        'count':8
                    })
                });
                obj[k] = impacteimpactedDevicesPerSites;
            }else if(k.includes('impacted_clients_per_site')){
                let impactedClientsPerSite = [];
                siteIds.forEach(siteId=>{
                    impactedClientsPerSite.push({
                        'name': `name-${siteId}`,
                        'count':8
                    })
                });
                obj[k] = impactedClientsPerSite;
            }
        }
    }
    return obj
}


const getShardAttr = shardId =>
    shardId.length > 8 ? shardId.substring(0, 8) : shardId;

module.exports = {
    generateNocLevelAnalyzers,
    generateSiteLevelAnalyzers
}

