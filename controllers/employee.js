const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const { titleCase } = require("../utils/functions");
const { admin } = require("../utils/data");

const Employee = require("../models/employee");
const jwt = require("../middlewares/jwt");
const bcrypt = require("bcryptjs");
var fs = require("fs");

const create_employee = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_email = await Employee.findOne({ email: data.email });
    if (exist_email) {
      if (req.files) {
        fs.unlinkSync(req.files.image.tempFilePath);
      }
      return res.json({ msg: "Este correo ya se encuentra registrado." });
    } else {
      if (req.files) {
        const tempFilePath = req.files.image.tempFilePath;
        const { public_id, secure_url } = await uploadImage(tempFilePath, "employees");
        data.image = { public_id, secure_url };
        fs.unlinkSync(tempFilePath);
      }
      data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
      data.full_name = titleCase(data.first_name + " " + data.last_name);
      let reg = await Employee.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_employees = async (req, res = response) => {
  let reg = await Employee.find();
  return res.json({ data: reg });
};

const read_employee_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Employee.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_employee = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const user = await Employee.findById(id);
    const { email, password, ...data } = req.body;

    if (user.email != email) {
      var exist_email = await Employee.findOne({ email });
      if (exist_email) {
        if (req.files) {
          fs.unlinkSync(req.files.image.tempFilePath);
        }
        return res.json({ msg: "Este correo ya se encuentra registrado." });
      } else {
        data.email = email;
      }
    }

    if (user._id == admin._id) {
      if (data.role != "Administrador") {
        if (req.files) {
          fs.unlinkSync(req.files.image.tempFilePath);
        }
        return res.json({ msg: "No puedes cambiar el rol para este usuario" });
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
      const { public_id, secure_url } = await uploadImage(tempFilePath, "employees");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
      if (user.image.public_id) {
        await deleteImage(user.image.public_id);
      }
    }
    let reg = await Employee.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_employee = async (req, res = response) => {
  let id = req.params["id"];
  try {
    user = await Employee.findById(id);
    if (user._id == admin._id) {
      return res.json({ msg: "No puedes eliminar un administrador." });
    } else if (req.id == id) {
      return res.json({ msg: "No puedes eliminar un usuario con sesión iniciada." });
    } else {
      let reg = await Employee.findByIdAndDelete(id);
      if (reg.image.public_id) {
        await deleteImage(reg.image.public_id);
      }
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let { status } = req.body;
  try {
    user = await Employee.findById(id);
    if (user._id == admin._id) {
      return res.json({ msg: "No puedes desactivar un administrador." });
    } else if (req.id == id) {
      return res.json({ msg: "No puedes desactivar un usuario con sesión iniciada." });
    } else {
      reg = await Employee.findByIdAndUpdate(id, { status });
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const login_employee = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await Employee.findOne({ email });
    if (!user) {
      return res.json({ msg: "El correo o la contraseña son incorrectos." });
    } else {
      var valid_password = bcrypt.compareSync(password, user.password);
      if (!valid_password) {
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
  create_employee,
  read_employees,
  read_employee_by_id,
  update_employee,
  delete_employee,
  change_status,
  login_employee,
};
