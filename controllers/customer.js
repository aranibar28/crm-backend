const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const { titleCase } = require("../utils/functions");
const { send_email_verify } = require("../middlewares/email");

const Customer = require("../models/customer");
const jwt = require("../middlewares/jwt");
const bcrypt = require("bcryptjs");
var fs = require("fs");

const create_customer = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_email = await Customer.findOne({ email: data.email });
    if (exist_email) {
      if (req.files) {
        fs.unlinkSync(req.files.image.tempFilePath);
      }
      return res.json({ msg: "Este correo ya se encuentra registrado." });
    } else {
      if (req.files) {
        const tempFilePath = req.files.image.tempFilePath;
        const { public_id, secure_url } = await uploadImage(tempFilePath, "customers");
        data.image = { public_id, secure_url };
        fs.unlinkSync(tempFilePath);
      }
      data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
      data.full_name = titleCase(data.first_name + " " + data.last_name);
      data.created_by = req.id;
      let reg = await Customer.create(data);
      if (JSON.parse(data.send_verify)) {
        send_email_verify(data.email);
      }
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_customers = async (req, res = response) => {
  let filter = req.params["filter"];

  if (filter == "all") {
    let reg = await Customer.find();
    return res.json({ data: reg });
  }

  let reg = await Customer.find({
    $or: [
      { first_name: new RegExp(filter, "i") },
      { last_name: new RegExp(filter, "i") },
      { email: new RegExp(filter, "i") },
      { dni: new RegExp(filter, "i") },
    ],
  });
  return res.json({ data: reg });
};

const read_customer_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer.findById(id).populate("created_by");
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_customer = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const user = await Customer.findById(id);
    const { email, password, ...data } = req.body;

    if (user.email != email) {
      var exist_email = await Customer.findOne({ email });
      if (exist_email) {
        if (req.files) {
          fs.unlinkSync(req.files.image.tempFilePath);
        }
        return res.json({ msg: "Este correo ya se encuentra registrado." });
      } else {
        data.email = email;
      }
    }

    if (user.password != password) {
      var new_password = bcrypt.hashSync(password, bcrypt.genSaltSync());
      data.password = new_password;
    } else {
      data.password = password;
    }

    data.full_name = titleCase(data.first_name + " " + data.last_name);

    if (req.files) {
      const tempFilePath = req.files.image.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, "customers");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
      if (user.image.public_id) {
        await deleteImage(user.image.public_id);
      }
    }

    if (JSON.parse(data.send_verify)) {
      send_email_verify(data.email);
    }

    let reg = await Customer.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_customer = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer.findByIdAndDelete(id);
    if (reg.image.public_id) {
      await deleteImage(reg.image.public_id);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let { status } = req.body;
  try {
    reg = await Customer.findByIdAndUpdate(id, { status });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const login_customer = async (req, res = response) => {
  let { email, password } = req.body;
  try {
    let user = await Customer.findOne({ email });
    if (!user) {
      return res.json({ msg: "El correo o la contraseña son incorrectos." });
    } else {
      let compare_password = bcrypt.compareSync(password, user.password);
      if (!compare_password) {
        return res.json({ msg: "El correo o la contraseña son incorrectos." });
      } else {
        if (!user.status) {
          return res.json({ msg: "El usuario no tiene acceso al sistema." });
        } else {
          const token = jwt.createToken(user);
          return res.json({ data: user, token });
        }
      }
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_customer,
  read_customers,
  read_customer_by_id,
  update_customer,
  delete_customer,
  change_status,
  login_customer,
};
