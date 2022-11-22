const { Schema, model } = require("mongoose");
const { opts } = require("../utils/data");

const SurveySchema = Schema({
  answ_one:    { type: String, required: true },
  answ_two:    { type: String, required: true },
  answ_three:  { type: String, required: true },
  answ_four:   { type: String, required: true },
  answ_five:   { type: String, required: true },
  answ_six:    { type: String, required: true },
  inscription: { type: Schema.Types.ObjectId, required: false, ref: "Inscription" },
  employee:    { type: Schema.Types.ObjectId, required: false, ref: "Employee" },
  customer:    { type: Schema.Types.ObjectId, required: false, ref: "Customer" },
}, opts);

SurveySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Survey", SurveySchema);