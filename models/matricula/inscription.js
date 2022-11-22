const { Schema, model } = require("mongoose");

const InscriptionSchema = Schema({
  origin:     { type: String, required: true },
  channel:    { type: String, required: true },
  matricula:  { type: Number, required: true },
  amount:     { type: Number, required: true },
  discount:   { type: Number, required: true },
  coupon:     { type: String, required: false },
  firm:       { type: String, required: false },
  date_firm:  { type: Date, required: false },
  survey:     { type: Boolean, required: false, default: false },
  renew:      { type: Boolean, required: true, default: false },
  status:     { type: String, required: true, default: "Procesando" },
  renovation: { type: Schema.Types.ObjectId, required: false, ref: "Inscription" },
  customer:   { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee:   { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  created_at: { type: Date, required: true, default: Date.now },
});

InscriptionSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Inscription", InscriptionSchema);