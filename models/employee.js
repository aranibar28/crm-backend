const { Schema, model } = require("mongoose");
const { opts } = require("../utils/data");

const EmployeeSchema = Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  first_name: { type: String, required: false },
  last_name:  { type: String, required: false },
  full_name:  { type: String, required: false },
  dni:        { type: String, required: false },
  phone:      { type: String, required: false },
  genre:      { type: String, required: false },
  status:     { type: Boolean, required: false, default: true },
  image:      { type: Object, required: false, default: {} },
  role:       { type: String, required: true, default: "Administrador" },
}, opts);

EmployeeSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Employee", EmployeeSchema);
