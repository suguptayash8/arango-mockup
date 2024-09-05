const {Database, aql} = require('arangojs');
const db = new Database('http://127.0.0.1:8529');
var isBult = false;
var collection;

  const build  = async function(){
    const names = await db.listDatabases()

    let res;
    if(names.indexOf('gvtstatedb') > -1){
        res = await db.useDatabase('gvtstatedb');
    }else{
       res = await db.createDatabase('gvtstatedb');
    }

    //console.log("is db created: {}" , res);
    collection = await db.collection('aiops_optimizer');
   
    // create the collection if it doesn't exist
    try {
        await collection.create(); // create the collection if it doesn't exist
      } catch (e) {}

    isBult = true;
  }

 ;

 const populateCollection = async function(doc){

    if(!isBult){
        await build();
    }

    try{
      const res = await collection.save(doc); 
      //console.log(res);
    }catch(e){

    }
    
}

module.exports = {
    populateCollection
}