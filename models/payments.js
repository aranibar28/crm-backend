const { Schema, model } = require("mongoose");
const moment = require("moment");

const PaymentsSchema = Schema({
  amount:             { type: Number, required: true },
  origin:             { type: String, required: true },
  method:             { type: String, required: true },
  bank:               { type: String, required: true },
  transaction:        { type: String, required: false },
  correlative:        { type: Number, required: true },
  status:             { type: String, required: true },
  type:               { type: String, required: true },
  date:               { type: String, required: true, default: moment().format("YYYY-MM-DD") },
  sale:               { type: Schema.Types.ObjectId, required: false, ref: "Sale" },
  sale_detail:        { type: Schema.Types.ObjectId, required: false, ref: "Sale_Detail" },
  inscription:        { type: Schema.Types.ObjectId, required: false, ref: "Inscription" },
  inscription_detail: { type: Schema.Types.ObjectId, required: false, ref: "Inscription_Detail" },
  employee:           { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  customer:           { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  created_at:         { type: Date, required: true, default: Date.now },
});

PaymentsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Payments", PaymentsSchema);