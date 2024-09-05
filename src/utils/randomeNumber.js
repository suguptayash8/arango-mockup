
/**
 * Math.random()  reuturn value [0,1) 0 inclusive , 1 exclusive
 * Math.floor(Math.random() * (end+1)) return value [0, end] both inclusive , example 51--> [0, 50.99] floor--> [0,50]
 * 
 * return number between [start, end] both inclusive
 */
const generateRandomNumber = function(start, end){
   return Math.floor(Math.random() * (end - start +1)) + start;
}


module.exports = {
    generateRandomNumber
}