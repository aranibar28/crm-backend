const { Schema, model } = require("mongoose");

const Sale_DetailSchema = Schema({
  quantity:   { type: Number, required: true },
  price:      { type: Number, required: true },
  status:     { type: String, required: true, default: "Procesando" },
  sale:       { type: Schema.Types.ObjectId, required: true, ref: "Sale" },
  product:    { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  variety:    { type: Schema.Types.ObjectId, required: true, ref: "Variety" },
  created_at: { type: Date, required: true, default: Date.now },
});

Sale_DetailSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Sale_Detail", Sale_DetailSchema);