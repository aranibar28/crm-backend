const { response } = require("express");
const { register_activity } = require("../utils/async");
const Customer = require("../models/customer");
const Inscription = require("../models/matricula/inscription");
const Survey = require("../models/survey");
const moment = require("moment");
const jwt = require("jwt-simple");

const generate_token = async (req, res = response) => {
  let inscription = req.params["inscription"];
  let customer = req.params["customer"];

  var payload = {
    inscription: inscription,
    customer: customer,
    iat: moment().unix(),
    exp: moment().add(1, "day").unix(),
  };

  let token = jwt.encode(payload, process.env.SECRET_KEY);
  return res.json({ token });
};

const send_survey = async (req, res = response) => {
  let data = req.body;
  let customer;
  let inscription;

  try {
    customer = await Customer.findById(data.customer);
  } catch (error) {
    return res.json({ msg: "El código del cliente no existe" });
  }

  try {
    inscription = await Inscription.findById(data.inscription);
    data.employee = inscription.employee;
  } catch (error) {
    return res.json({ msg: "El código de la inscripción no existe" });
  }

  let surveys = await Survey.find({ customer: customer._id, inscription: inscription._id });

  if (surveys.length == 0) {
    let reg = await Survey.create(data);
    await Inscription.findByIdAndUpdate(inscription._id, { survey: true });
    register_activity("El cliente completó la encuesta", req.id, inscription._id);
    return res.json({ data: reg });
  } else {
    return res.json({ msg: "Ya se envió una respuesta de esta encuesta." });
  }
};

const read_survey = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Survey.findOne({ inscription: id });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const confirm_email_verify = async (req, res = response) => {
  let token_params = req.params["token"];
  let token = token_params.replace(/['"]+/g, "");
  let segment = token.split(".");

  if (segment.length != 3) {
    return res.status(403).send({ msg: "Invalid verify token" });
  } else {
    try {
      var payload = jwt.decode(token, process.env.SECRET_KEY);
      await Customer.findByIdAndUpdate(payload.sub, { verify: true });
      return res.status(200).send({ data: true });
    } catch (error) {
      return res.status(200).send({ msg: "Expired verify token", data: undefined });
    }
  }
};

const verify_token = async (req, res = response) => {
  if (req.user) {
    const payload = req.user;

    if (payload.exp <= moment().unix()) {
      return res.json({ data: false });
    }

    return res.json({ data: true });
  } else {
    return res.json({ data: false });
  }
};

module.exports = {
  generate_token,
  send_survey,
  read_survey,
  confirm_email_verify,
  verify_token,
};
