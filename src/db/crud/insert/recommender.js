const fs = require('fs');
const path = require('path');
const { populateCollection } = require('../../createDB.js')

// Assuming the JSON file is named data.json and is in the same directory as this script
const filePath = path.join(__dirname,  '../../../optimizers/recommender712.json');

// Reading the JSON file
const { readFile } = require('../../../utils/readFile.js');

const insert= (recoId, count)=> {
    const recommmenderPath = path.join(__dirname,  `../../../optimizers/recommender${recoId}.json`);
    const sitePath = path.join(__dirname,  `../../../mock/sites/sites.json`);
    const tenantsPath = path.join(__dirname,  `../../../mock/tenants/tenants.json`);
    const analyzersPath = path.join(__dirname,  `../../../mock/analyzers/analyzers.json`);
    const recommenderObjs =  JSON.parse(readFile(recommmenderPath));
    const recommenderData = recommenderObjs[0];
    const siteData  = JSON.parse(readFile(sitePath));
    const  tenantsData = JSON.parse(readFile(tenantsPath));
    const analyzersData = JSON.parse(readFile(analyzersPath));

    for(let i = 0; i < count; i++){
        const siteId = siteData[Math.round(Math.random() * 300 + 1)];
        const tenantId = tenantsData[Math.round(Math.random() * 20)];

        console.log("tenant id is" + tenantId);
        //const analyzerId = analyzersData[Math.round(Math.random() * 10 + 4)]
        const sharedAttr = getShardAttr(tenantId);
        const timestamp = Date.now();
        const _key = `${sharedAttr}:${Math.round(Math.random()* 7000000000)}`;
        const _id = `aiops_optimizer/${_key}`;
        const analyzer_id = `${tenantId}_${siteId}_${recoId}_39751_0_${recommenderData.created}`

        let override = {
            "_key": _key,
            "_id":_id,
            "analyzer_id":analyzer_id,
            "site_id":siteId,
            "tenant_id":tenantId,
            "timestamp":timestamp
        }
        let mockRecomData = {...override, recommenderData}
        console.log("key generated: {}" + _key);
        console.log("mock rec key: " + mockRecomData._key );

        try{
            populateCollection(mockRecomData);
        }catch(e){

        }
        
    }
}


const getShardAttr = shardId =>
    shardId.length > 8 ? shardId.substring(0, 8) : shardId;

module.exports = {
    insert
}




