const express = require('express');
const cors = require('cors');
const app = express();
const {generateInsights} = require('../index.js')

app.use(cors());

app.use(express.json());
const port = 8060;

app.use(express.urlencoded({
    extended: true
}));

app.post('/api/generate-insights', (req, res) => {
  generateInsights();
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`arango mock up server listening on: ${port}`)
});