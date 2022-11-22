const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const Customer_InterestSchema = Schema({
  date:     { type: String, required: true },
  note:     { type: String, required: true },
  type:     { type: String, required: true },
  level:    { type: String, required: true },
  cycle:    { type: String, required: true },
  course:   { type: Schema.Types.ObjectId, required: false, ref: "Course" },
  customer: { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
}, opts);

Customer_InterestSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer_Interest", Customer_InterestSchema);