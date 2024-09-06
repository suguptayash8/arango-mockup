const {Database, aql} = require('arangojs');
const db = new Database('http://arangodb:8529');
//const db = new Database('http://127.0.0.1:8529');
var isBult = false;
var collection;

  const build  = async function(){
    const names = await db.listDatabases();
    let res;
    if(!names.includes('gvtstatedb')){
      res = await db.createDatabase('gvtstatedb');
    }
    await db.useDatabase('gvtstatedb');
    //console.log("is db created: {}" , res);
    collection = await db.collection('aiops_optimizer');
   
    // create the collection if it doesn't exist
    try {
        await collection.create(); // create the collection if it doesn't exist
      } catch (e) {
        let errorMsg = {
          'timestamp':Date.now(),
          'date': new Date(),
          'functonName': 'build',
          'code': e?.code,
          'message': e?.message,
          'retryCount': retry,
          'level': "ERROR"
        }
        console.error(errorMsg);
      }

    isBult = true;
  }

 ;

 const populateCollection = async function(doc){

    try{
      if(!isBult){
        await build();
      }

      const res = await collection.save(doc); 
      //console.log(res);
    }catch(e){
      let errorMsg = {
        'timestamp':Date.now(),
        'date': new Date(),
        'functonName': 'populateCollection',
        'code': e?.code,
        'message': e?.message,
        'retryCount': retry,
        'level': "ERROR",
        'query': JSON.stringify(doc)
      }
      console.error(errorMsg);
    }
    
}

module.exports = {
    populateCollection
}