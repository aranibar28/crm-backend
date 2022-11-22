const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const Customer_TaskSchema = Schema({
  title:         { type: String, required: true },
  date:          { type: String, required: true },
  time:          { type: String, required: true },
  type:          { type: String, required: true },
  priority:      { type: String, required: true },
  note:          { type: String, required: true },
  status:        { type: Boolean, required: true, default: false },
  customer:      { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee:      { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  employee_make: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  employee_date: { type: Date, required: false },
}, opts);

Customer_TaskSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer_Task", Customer_TaskSchema);