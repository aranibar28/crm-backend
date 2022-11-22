const { response } = require("express");
const { register_activity, update_type_prospect } = require("../utils/async");
const Payment = require("../models/payments");
const Customer = require("../models/customer");
const Inscription = require("../models/matricula/inscription");
const Inscription_Detail = require("../models/matricula/inscription_detail");

const create_inscription_payment = async (req, res = response) => {
  let data = req.body;
  try {
    let fx = await Inscription.findById(data.inscription);
    let payments = await Payment.find({ customer: data.customer, inscription: data.inscription });

    let sum = 0;
    for (let item of payments) {
      sum += item.amount;
    }

    let deuda = fx.amount + fx.matricula - sum;

    if (data.amount > deuda || data.amount <= 0) {
      return res.json({ msg: "No puedes pagar una cantidad superior a la deuda." });
    } else {
      let pays = await Payment.find().sort({ created_at: -1 });
      if (pays.length == 0) {
        data.correlative = 1;
      } else {
        let last_correlative = pays[0].correlative;
        data.correlative = last_correlative + 1;
      }

      if (data.destination != "Matricula") {
        data.inscription_detail = data.destination;
      }

      if (data.amount - deuda == 0) {
        await Inscription.findByIdAndUpdate(data.inscription, { status: "Aprobado" });
        await Inscription_Detail.updateMany({ inscription: data.inscription }, { status: "Aprobado" });
      }

      data.employee = req.id;
      data.status = "Aprobado";
      let reg = await Payment.create(data);

      update_type_prospect(data.customer);
      register_activity(`Se generó un pago de S/. ${data.amount}`, req.id, data.inscription);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_inscription_payments = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Payment.find({ inscription: id }).populate({
      path: "inscription_detail",
      populate: {
        path: "course",
      },
    });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_inscription_payment,
  read_inscription_payments,
};
