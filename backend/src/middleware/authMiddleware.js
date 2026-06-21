function adminAuth(req, res, next) {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha de administrador incorreta.' });
  }

  next();
}

module.exports = { adminAuth };
