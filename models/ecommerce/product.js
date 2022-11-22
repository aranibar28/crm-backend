const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const ProductSchema = Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  type:        { type: String, required: true },
  slug:        { type: String, required: false },
  variety:     { type: String, required: false },
  stock:       { type: Number, required: false, default: 0 },
  price:       { type: Number, required: false, default: 0 },
  image:       { type: Object, required: false, default: {} },
  status:      { type: Boolean, required: true, default: false },
  category:    { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  created_by:  { type: Schema.Types.ObjectId, required: true, ref: "Employee" },
}, opts);

ProductSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Product", ProductSchema);