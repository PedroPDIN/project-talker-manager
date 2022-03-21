const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');
const { isValidEmail, isValidPassword } = require('./middlewares/validation');

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

app.listen(PORT, () => {
  console.log('Online');
});
