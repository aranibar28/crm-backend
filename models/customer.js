const { Schema, model } = require("mongoose");
const { opts } = require("../utils/data");

const CustomerSchema = Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  first_name: { type: String, required: false },
  last_name:  { type: String, required: false },
  full_name:  { type: String, required: false },
  dni:        { type: String, required: false },
  phone:      { type: String, required: false },
  genre:      { type: String, required: false },
  birthday:   { type: String, required: false },
  country:    { type: String, required: false },
  city:       { type: String, required: false },
  status:     { type: Boolean, required: true, default: true },
  verify:     { type: Boolean, required: true, default: false },
  type:       { type: String, required: true, default: "Prospecto" },
  image:      { type: Object, required: false, default: {} },
  created_by: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
}, opts);

CustomerSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer", CustomerSchema);
