const User = require("../models/employee");
const { getRole } = require("../utils/functions");

const validateADMIN = async (req, res, next) => {
  const id = req.id;
  try {
    const user = await User.findById(id);
    const ADMIN_USER = getRole("Administrador");
    if (!user) {
      return res.status(404).json({ msg: "Ususario no encontrado" });
    }
    if (!ADMIN_USER.includes(user.role)) {
      return res.json({ msg: "No tiene privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado... contacte con un administrador!" });
  }
};

const validateSELLER = async (req, res, next) => {
  const id = req.id;
  try {
    const user = await User.findById(id);
    const SELLER_USER = getRole("Vendedor");
    if (!user) {
      return res.status(404).json({ msg: "Ususario no encontrado" });
    }
    if (!SELLER_USER.includes(user.role)) {
      return res.json({ msg: "No tiene privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado... contacte con un administrador!" });
  }
};

const validateINSTRUCTOR = async (req, res, next) => {
  const id = req.id;
  try {
    const user = await User.findById(id);
    const INSTRUCTOR_USER = getRole("Instructor");
    if (!user) {
      return res.status(404).json({ msg: "Ususario no encontrado" });
    }
    if (!INSTRUCTOR_USER.includes(user.role)) {
      return res.json({ msg: "No tiene privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado... contacte con un administrador!" });
  }
};

module.exports = {
  validateADMIN,
  validateSELLER,
  validateINSTRUCTOR,
};
