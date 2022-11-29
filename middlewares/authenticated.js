const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const validateJWT = (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ msg: "No se proporcionó ningun token." });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    req.role = payload.role;
    req.id = payload.sub;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token no válido" });
  }
};

module.exports = { validateJWT };
