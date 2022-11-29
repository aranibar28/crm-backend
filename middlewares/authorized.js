const { request, response } = require("express");
const { getRole } = require("../utils/functions");

const validateADMIN = async (req = request, res = response, next) => {
  const role = req.role;
  try {
    const ADMIN_USER = getRole("Administrador");
    if (!ADMIN_USER.includes(role)) {
      return res.json({ msg: "No tienes privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado, contacte con un administrador." });
  }
};

const validatePROFILE = async (req = request, res = response, next) => {
  const role = req.role;
  const id = req.id;
  try {
    const ADMIN_USER = getRole("Administrador");
    if (ADMIN_USER.includes(role) || id == req.params["id"]) {
      next();
    } else {
      return res.json({ msg: "No tienes privilegios para realizar esta acción." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado, contacte con un administrador." });
  }
};

const validateSELLER = async (req = request, res = response, next) => {
  const role = req.role;
  try {
    const SELLER_USER = getRole("Vendedor");
    if (!SELLER_USER.includes(role)) {
      return res.json({ msg: "No tienes privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado, contacte con un administrador." });
  }
};

const validateINSTRUCTOR = async (req = request, res = response, next) => {
  const role = req.role;
  try {
    const INSTRUCTOR_USER = getRole("Instructor");
    if (!INSTRUCTOR_USER.includes(role)) {
      return res.json({ msg: "No tienes privilegios para realizar esta acción." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado, contacte con un administrador." });
  }
};

module.exports = {
  validateADMIN,
  validatePROFILE,
  validateSELLER,
  validateINSTRUCTOR,
};
