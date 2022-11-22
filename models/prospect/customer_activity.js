const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const Customer_ActivitySchema = Schema({
  type:     { type: String, required: true },
  activity: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
}, opts);

Customer_ActivitySchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer_Activity", Customer_ActivitySchema);