const isValidEmail = (req, res, next) => {
  const { email } = req.body;
  const RGX = /\S+@\S+\.\S+/;
  const boolValid = RGX.test(email);

  if (!email) {
    return res.status(400).json({ 
    message: 'O campo "email" é obrigatório',
  }); 
}

  if (boolValid === false) {
    return res.status(400).json({ 
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }

  next();
};

const isValidPassword = (req, res, next) => {
  const { password } = req.body;
  const passwordLength = password && password.length;

  if (!password) {
    return res.status(400).json({
    message: 'O campo "password" é obrigatório',
    });
  }

  if (passwordLength < 6) {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    });
  }

  next();
};

module.exports = {
  isValidEmail,
  isValidPassword,
};