const Customer = require("../models/customer");
const Customer_Activity = require("../models/prospect/customer_activity");
const Inscription_Comment = require("../models/matricula/inscription_comments");

const Product = require("../models/ecommerce/product");
const Variety = require("../models/ecommerce/variety");

const create_activity = async (type, activity, customer, employee) => {
  let data = { type, activity, customer, employee };
  await Customer_Activity.create(data);
};

const register_activity = async (activity, employee, inscription) => {
  await Inscription_Comment.create({
    activity: activity,
    employee: employee,
    inscription: inscription,
  });
};

const update_type_prospect = async (id) => {
  let customer = await Customer.findById(id);
  if (customer.type == "Prospecto") {
    await Customer.findByIdAndUpdate(id, { type: "Cliente" });
  }
};

const decrease_stock = async (id_variety, id_product, qty) => {
  // STOCK VARIEDAD
  let variety = await Variety.findById(id_variety);
  let new_stock_v = variety.stock - qty;
  await Variety.findByIdAndUpdate(id_variety, { stock: new_stock_v });

  // STOCK PRODUCTO GENERAL
  let product = await Product.findById(id_product);
  let new_stock_p = product.stock - qty;
  await Product.findByIdAndUpdate(id_product, { stock: new_stock_p });
};

const increase_stock = async (id_variety, id_product, qty) => {
  // STOCK VARIEDAD
  let variety = await Variety.findById(id_variety);
  let new_stock_v = variety.stock + qty;
  await Variety.findByIdAndUpdate(id_variety, { stock: new_stock_v });

  // STOCK PRODUCTO GENERAL
  let product = await Product.findById(id_product);
  let new_stock_p = product.stock + qty;
  await Product.findByIdAndUpdate(id_product, { stock: new_stock_p });
};

module.exports = {
  create_activity,
  register_activity,
  update_type_prospect,
  decrease_stock,
  increase_stock,
};
