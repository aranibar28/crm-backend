const jwt = require("jwt-simple");
const moment = require("moment");
const secret = process.env.SECRET_KEY;

const createToken = (user) => {
  const payload = {
    sub: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    image: user.image?.secure_url,
    iat: moment().unix(),
    exp: moment().add(12, "h").unix(),
  };
  return jwt.encode(payload, secret);
};

const createTokenPublic = (user) => {
  const payload = {
    sub: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    type: user.type,
    iat: moment().unix(),
    exp: moment().add(12, "h").unix(),
  };
  return jwt.encode(payload, secret);
};

const generateTokenMenu = (menu) => {
  return jwt.encode(menu, secret);
};

module.exports = {
  createToken,
  createTokenPublic,
  generateTokenMenu,
};
