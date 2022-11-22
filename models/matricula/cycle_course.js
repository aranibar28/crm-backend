const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const Cycle_CourseSchema = Schema({
  nivel:        { type: String, required: true },
  sede:         { type: String, required: true },
  price:        { type: Number, required: true },
  start_date:   { type: String, required: true },
  final_date:   { type: String, required: true },
  inscription:  { type: String, required: true },
  months:       { type: Object, required: true },
  year:         { type: Number, required: true },
  description:  { type: String, required: false },
  status:       { type: Boolean, required: true, default: false },
  course:       { type: Schema.Types.ObjectId, required: false, ref: "Course" },
  employee:     { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
}, opts);

Cycle_CourseSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Cycle_Course", Cycle_CourseSchema);