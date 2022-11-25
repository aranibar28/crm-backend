var jwt = require("jwt-simple");
var moment = require("moment");
var secret = process.env.SECRET_KEY;

const createToken = (user) => {
  var payload = {
    sub: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    image: user.image?.secure_url,
    iat: moment().unix(),
    exp: moment().add(1, "days").unix(),
  };
  return jwt.encode(payload, secret);
};

const createTokenPublic = (user) => {
  var payload = {
    sub: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    type: user.type,
    iat: moment().unix(),
    exp: moment().add(7, "days").unix(),
  };
  return jwt.encode(payload, secret);
};

module.exports = {
  createToken,
  createTokenPublic,
};
