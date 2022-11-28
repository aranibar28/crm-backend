const { response } = require("express");
const { register_activity, update_type_prospect, decrease_stock, increase_stock } = require("../utils/helpers");
const Sale = require("../models/ecommerce/sale");
const Sale_Detail = require("../models/ecommerce/sale_detail");
const Payment = require("../models/payments");
const moment = require("moment");

const create_sale = async (req, res = response) => {
  let data = req.body;

  try {
    data.employee = req.id;
    let reg = await Sale.create(data);

    for (let item of data.details) {
      let details = {
        sale: reg._id,
        product: item.product,
        variety: item.variety,
        quantity: item.quantity,
        price: item.price,
      };

      let reg_detail = await Sale_Detail.create(details);

      let payment = {
        sale: reg._id,
        sale_detail: reg_detail._id,
        customer: reg.customer,
        employee: reg.employee,
        amount: item.price * item.quantity,
        bank: data.bank,
        method: data.method,
        origin: "Interno",
        type: "Venta",
        status: "Aprobado",
      };

      let pays = await Payment.find().sort({ created_at: -1 });
      if (pays.length == 0) {
        payment.correlative = 1;
        await Payment.create(payment);
      } else {
        let last_correlative = pays[0].correlative;
        payment.correlative = last_correlative + 1;
        await Payment.create(payment);
      }
      register_activity("Se registró una venta del cliente.", req.id, reg._id);
      update_type_prospect(reg.customer);
      decrease_stock(reg_detail.variety, reg_detail.product, reg_detail.quantity);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const cancel_sale = async (req, res = response) => {
  let id = req.params["id"];

  try {
    let reg = await Sale.findByIdAndUpdate(id, { status: "Cancelado" });

    let details = await Sale_Detail.find({ sale: reg._id });
    for (let item of details) {
      increase_stock(item.variety, item.product, item.quantity);
    }

    await Sale_Detail.updateMany({ sale: id }, { status: "Cancelado" });
    await Payment.updateMany({ sale: id }, { status: "Cancelado" });

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const accept_sale = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Sale.findByIdAndUpdate(id, { status: "Procesando" });

    let details = await Sale_Detail.find({ sale: reg._id });
    for (let item of details) {
      decrease_stock(item.variety, item.product, item.quantity);
    }

    await Sale_Detail.updateMany({ sale: id }, { status: "Procesando" });
    await Payment.updateMany({ sale: id }, { status: "Aprobado" });

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const pass_sale = async (req, res = response) => {
  let id = req.params["id"];

  try {
    let reg = await Sale.findByIdAndUpdate(id, { status: "Aprobado" });
    await Sale_Detail.updateMany({ sale: id }, { status: "Aprobado" });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_sales_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let sale = await Sale.findById(id).populate("customer").populate("employee");
    let details = await Sale_Detail.find({ sale: id }).populate("product").populate("variety");
    return res.json({ sale, details });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_sales_today = async (req, res = response) => {
  try {
    let reg = await Sale.find().populate("customer").populate("employee").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_sales_dates = async (req, res = response) => {
  try {
    let employee = req.params["employee"];
    let from = req.params["from"];
    let to = req.params["to"];
    let reg = [];

    const start = moment(from).startOf("day");
    const end = moment(to).endOf("day");

    if (employee == "all") {
      reg = await Sale.find({
        created_at: {
          $gte: start,
          $lte: end,
        },
      })
        .populate("customer")
        .populate("employee")
        .sort({ created_at: -1 });
    } else {
      reg = await Sale.find({
        created_at: {
          $gte: start,
          $lte: end,
        },
        employee,
      })
        .populate("customer")
        .populate("employee")
        .sort({ created_at: -1 });
    }

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_sale,
  accept_sale,
  cancel_sale,
  pass_sale,
  read_sales_by_id,
  read_sales_today,
  read_sales_dates,
};
