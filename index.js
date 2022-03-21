const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const fileJson = () => fs.readFile('./talker.json', 'utf-8')
  .then((data) => JSON.parse(data));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const dataTalker = await fileJson();

  try {
    res.status(200).json(dataTalker);
  } catch (error) {
    res.status(200).json([]);
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
