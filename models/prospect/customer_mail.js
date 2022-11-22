const { Schema, model } = require("mongoose");
const { opts } = require("../../utils/data");

const Customer_MailSchema = Schema({
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
  employee: { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
}, opts);

Customer_MailSchema.method("toJSON", function () {
  const { __v,  ...object } = this.toObject();
  return object;
});

module.exports = model("Customer_Mail", Customer_MailSchema);