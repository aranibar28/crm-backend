const { Schema, model } = require("mongoose");
const { opts } = require("../utils/data");

const CompanySchema = Schema({
  ruc:         { type: String, required: true },
  company:     { type: String, required: true },
  address:     { type: String, required: true },
  phone:       { type: String, required: true },
  branding:    { type: String, required: true },
  slogan:      { type: String, required: true },
  logo:        { type: Object, required: false, default: {} },
  channels:    { type: Object, required: false, default: [] },
  varieties:   { type: Object, required: false, default: [] },
  earnings:    { type: Number, required: false, default: 0 },
}, opts);

CompanySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Company", CompanySchema);