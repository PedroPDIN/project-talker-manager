const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const { isValidEmail, isValidPassword } = require('./middlewares/validation');
const { 
  isValidToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidTalkWatchedAt,
  isValidTalkRate,
} = require('./middlewares/validationTalker');

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

app.get('/talker/search', isValidToken, async (req, res) => {
  const { q } = req.query;
  const dataTalker = await fileJson();
  const valueQuery = q.toLowerCase();
  
  const filterData = dataTalker.filter((v) => v.name.toLowerCase().includes(valueQuery));

  if (!valueQuery) return res.status(200).json(dataTalker);

  try {
    res.status(200).json(filterData);
  } catch (error) {
    res.status(200).json([]);
  }
});

app.get('/talker', async (req, res) => {
  const dataTalker = await fileJson();

  try {
    res.status(200).json(dataTalker);
  } catch (error) {
    res.status(200).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const dataTalker = await fileJson();
  const { id } = req.params;
  const filterIdTalker = dataTalker.find((v) => v.id === Number(id));

 if (!filterIdTalker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

    res.status(200).json(filterIdTalker);
});

app.post('/login', isValidEmail, isValidPassword, (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');

  res.status(200).json({ token });
});

app.post('/talker', 
isValidToken,
isValidName,
isValidAge,
isValidTalk,
isValidTalkWatchedAt,
isValidTalkRate,
async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const dataTalker = await fileJson();
  const newId = dataTalker.length + 1;
  const newData = { name, age, id: newId, talk: { watchedAt, rate } };

  dataTalker.push(newData);
  const newDataTalker = JSON.stringify(dataTalker, null, 2);

  await fs.writeFile('./talker.json', newDataTalker);
  res.status(201).json(newData);
});

app.put('/talker/:id', 
isValidToken,
isValidName,
isValidAge,
isValidTalk,
isValidTalkWatchedAt,
isValidTalkRate,
async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const dataTalker = await fileJson();
  const filterIndex = dataTalker.findIndex((v) => v.id === Number(id));

  dataTalker[filterIndex] = {
    ...dataTalker[filterIndex], name, age, talk: { watchedAt, rate },
  };

  await fs.writeFile('./talker.json', JSON.stringify(dataTalker));

  res.status(200).json(dataTalker[filterIndex]);
});

app.delete('/talker/:id',
isValidToken,
async (req, res) => {
  const { id } = req.params;
  const dataTalker = await fileJson();
  const filterIndex = dataTalker.findIndex((v) => v.id === Number(id));

  dataTalker.splice(filterIndex, 1);

  await fs.writeFile('./talker.json', JSON.stringify(dataTalker));

  res.status(204).json(dataTalker[filterIndex]);
  });

app.listen(PORT, () => {
  console.log('Online');
});
