var jwt = require("jwt-simple");
var moment = require("moment");
var secret = process.env.SECRET_KEY;

const validateJWT = (req, res, next) => {
  if (!req.headers.token) {
    return res.status(403).send({ msg: "No se proporcionó ningun token." });
  }

  var token = req.headers.token.replace(/['"]+/g, "");
  var segment = token.split(".");

  if (segment.length != 3) {
    return res.status(403).send({ msg: "Invalid token" });
  } else {
    try {
      var payload = jwt.decode(token, secret);
      if (payload.exp <= moment().unix()) {
        return res.status(403).send({ msg: "Expired token" });
      }
    } catch (error) {
      return res.status(403).send({ msg: "Invalid token" });
    }
  }
  req.user = payload;
  req.role = payload.role;
  req.id = payload.sub;
  next();
};

module.exports = { validateJWT };
