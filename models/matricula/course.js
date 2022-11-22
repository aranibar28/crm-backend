const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const CourseSchema = Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  slug:        { type: String, required: true },
  image:       { type: Object, required: false, default: {} },
  status:      { type: Boolean, required: true, default: false },
}, opts);

CourseSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Course", CourseSchema);