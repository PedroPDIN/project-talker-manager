const isValidToken = (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  if (token.length < 16) {
    return res.status(401).json({ 
      message: 'Token inválido', 
    }); 
  }
  next();
};

const isValidName = (req, res, next) => {
  const { name } = req.body;
  const nameLength = name && name.length;
  
  if (!name) { return res.status(400).json({ message: 'O campo "name" é obrigatório' }); }
  if (nameLength < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const isValidAge = (req, res, next) => {
  const { age } = req.body;
  const numberAge = age && Number(age);

  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (numberAge < 18) {
    return res.status(400).json({ 
    message: 'A pessoa palestrante deve ser maior de idade',
  }); 
  }
  next();
};

const isValidTalk = (req, res, next) => {
  const { talk } = req.body;

 if (!talk || !talk.watchedAt || talk.rate === undefined) { 
   return res.status(400).json({ 
     message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  next();
}; 

const isValidTalkWatchedAt = (req, res, next) => {
// linha 55: regex inspirado no link abaixo.
// https://pt.stackoverflow.com/questions/371316/valida%C3%A7%C3%A3o-regex-de-data-com-2-2-4-caracteres
// link recebido por Emerson turma 16 For(ever)
  const { talk } = req.body;
  const test = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const bool = test.test(talk.watchedAt);

   if (!bool) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
   }
   next();
};

const isValidTalkRate = (req, res, next) => {
    const { talk } = req.body;
    if (talk.rate < 1 || talk.rate > 5) {
      return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
    }
    next();
};

module.exports = {
  isValidToken,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidTalkWatchedAt,
  isValidTalkRate,
};
