const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const InventorySchema = Schema({
  unit_price: { type: Number, required: true },
  quantity:   { type: Number, required: true },
  supplier:   { type: String, required: false },
  earnings:   { type: Number, required: false, default: 0 },
  variety:    { type: Schema.Types.ObjectId, required: true, ref: "Variety" },
  product:    { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  created_by: { type: Schema.Types.ObjectId, required: true, ref: "Employee" },
}, opts);

InventorySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Inventory", InventorySchema);