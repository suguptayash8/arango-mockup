const express = require('express');
const app = express();
const insert = require('../db/crud/insert/recommender.js')

app.use(express.json());
const port = 3000;

app.use(express.urlencoded({
    extended: true
}));

app.post('/recommender/add', (req, res) => {
  const obj = req.body;
  const { count, recoId } = obj;
  insert(recoId, count, obj);
})

app.listen(port, () => {
  console.log(`arango mock up server listening on: ${port}`)
});