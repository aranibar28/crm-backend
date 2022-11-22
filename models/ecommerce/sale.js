const { Schema, model } = require("mongoose");

const SaleSchema = Schema({
  origin:     { type: String, required: true },
  channel:    { type: String, required: true },
  amount:     { type: Number, required: true },
  method:     { type: String, required: true },
  bank:       { type: String, required: true },
  status:     { type: String, required: true, default: "Procesando" },
  customer:   { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee:   { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  created_at: { type: Date, required: true, default: Date.now },
});

SaleSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Sale", SaleSchema);