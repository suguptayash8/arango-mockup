const fs = require('fs');
const path = require('path');
const { populateCollection } = require('../../createDB.js')

// Assuming the JSON file is named data.json and is in the same directory as this script
const filePath = path.join(__dirname,  '../../../optimizers/recommender712.json');

// Reading the JSON file
const { readFile } = require('../../../utils/readFile.js');

const insert= (recoId, count, obj = {})=> {
    const recommmenderPath = path.join(__dirname,  `../../../optimizers/recommender${recoId}.json`);
    const sitePath = path.join(__dirname,  `../../../mock/sites/sites.json`);
    const tenantsPath = path.join(__dirname,  `../../../mock/tenants/tenants.json`);
    const analyzersPath = path.join(__dirname,  `../../../mock/analyzers/analyzers.json`);
    const recommenderObjs =  JSON.parse(readFile(recommmenderPath));
    let recommenderData = recommenderObjs[0];
    let siteData  = JSON.parse(readFile(sitePath));
    let  tenantsData = JSON.parse(readFile(tenantsPath));
    const analyzersData = JSON.parse(readFile(analyzersPath));

    for(let i = 0; i < count; i++){
        let siteId = siteData[Math.round(Math.random() * 300 + 1)];
        let tenantId = tenantsData[Math.round(Math.random() * 20)];

        //console.log("tenant id is" + tenantId);
        //const analyzerId = analyzersData[Math.round(Math.random() * 10 + 4)]
        let sharedAttr = getShardAttr(tenantId);
        let timestamp = Date.now();
        let _key = `${sharedAttr}:${Math.round(Math.random()* 7000000000)}`;
        let _id = `aiops_optimizer/${_key}`;
        let analyzer_id = `${tenantId}_${siteId}_${recoId}_39751_0_${recommenderData.created}`

        console.count("Insert data");
        console.count(`insert data for recommender: ${recoId}`);
        console.count(`count to insert data for recommender: ${recoId}  tenantId: ${tenantId}  siteId: ${siteId} is`);
    

        let override = {
            "_key": _key,
            "_id":_id,
            "analyzer_id":analyzer_id,
            "site_id":siteId,
            "tenant_id":tenantId,
            "timestamp":timestamp,
            "shard_attr":sharedAttr
        }
        let mockRecomData = {...recommenderData, ...override, ...obj};
        //console.log("key generated: {}" + _key  + "generated _key: " +  mockRecomData._key);
        //console.log("recommender data : " + JSON.stringify(recommenderData) );

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




