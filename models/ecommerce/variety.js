const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const VarietySchema = Schema({
  title:      { type: String, required: true },
  sku:        { type: String, required: true },
  stock:      { type: Number, required: false, default: 0 },
  product:    { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "Employee" },
}, opts);

VarietySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Variety", VarietySchema);