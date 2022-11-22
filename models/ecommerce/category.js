const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const CategorySchema = Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image:       { type: Object, required: false, default: {} },
  status:      { type: Boolean, required: true, default: false },
}, opts);

CategorySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Category", CategorySchema);