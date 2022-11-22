const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const { generateSlug } = require("../utils/functions");
const { arr_months } = require("../utils/data");
const moment = require("moment");
const fs = require("fs");

const Product = require("../models/ecommerce/product");
const Variety = require("../models/ecommerce/variety");
const Inventory = require("../models/ecommerce/inventory");
const Sale_Detail = require("../models/ecommerce/sale_detail");

const create_product = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_title = await Product.findOne({ title: data.title });
    if (exist_title) {
      if (req.files) {
        fs.unlinkSync(req.files.image.tempFilePath);
      }
      return res.json({ msg: "Este título ya se encuentra registrado." });
    } else {
      if (req.files) {
        const tempFilePath = req.files.image.tempFilePath;
        const { public_id, secure_url } = await uploadImage(tempFilePath, "products");
        data.image = { public_id, secure_url };
        fs.unlinkSync(tempFilePath);
      }
      data.created_by = req.id;
      data.slug = generateSlug(data.title);
      let reg = await Product.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_products = async (req, res = response) => {
  let reg = await Product.find().sort({ title: 1 }).populate("category");
  return res.json({ data: reg });
};

const read_product_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Product.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_product = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const product = await Product.findById(id);
    const { title, ...data } = req.body;

    if (product.title != title) {
      let exist_title = await Product.findOne({ title });
      if (exist_title) {
        if (req.files) {
          fs.unlinkSync(req.files.image.tempFilePath);
        }
        return res.json({ msg: "Este título ya se encuentra registrado." });
      }
    }

    data.title = title;
    data.slug = generateSlug(title);

    if (req.files) {
      const tempFilePath = req.files.image.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, "products");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
      if (product.image.public_id) {
        await deleteImage(product.image.public_id);
      }
    }
    let reg = await Product.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_product = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let product = await Product.findById(id);
    if (product.stock != 0) {
      return res.json({ msg: "El stock debe estar en 0 para eliminarlo." });
    } else {
      let reg = await Product.findByIdAndDelete(id);
      await Variety.deleteMany({ product: reg._id });
      if (reg.image.public_id) {
        await deleteImage(reg.image.public_id);
      }
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let { status } = req.body;
  try {
    reg = await Product.findByIdAndUpdate(id, { status });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Variedadades
const create_variety = async (req, res = response) => {
  let data = req.body;

  try {
    data.product = req.params["id"];
    data.created_by = req.id;
    let reg = await Variety.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_varieties = async (req, res = response) => {
  try {
    let reg = await Variety.find({ status: true }).populate("product").sort({ title: 1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_variety_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Variety.find({ product: id });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_variety = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let variety = await Variety.findById(id);
    if (variety.stock == 0) {
      let reg = await Variety.findByIdAndDelete(id);
      return res.json({ data: reg });
    } else {
      return res.json({ msg: "El stock debe estar en 0 para eliminarlo." });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Inventario
const create_inventory = async (req, res = response) => {
  let data = req.body;

  try {
    data.created_by = req.id;
    let reg = await Inventory.create(data);

    // Actualizar stock general
    let product = await Product.findById(data.product);
    let new_stock1 = product.stock + data.quantity;
    await Product.findByIdAndUpdate({ _id: data.product }, { stock: new_stock1 });

    // Actualizar stock variedad
    let variety = await Variety.findById(data.variety);
    let new_stock2 = variety.stock + data.quantity;
    await Variety.findByIdAndUpdate({ _id: data.variety }, { stock: new_stock2 });

    // Recibir datos del margen de ganancia
    let monto_ganancia = Math.round((data.unit_price * data.earnings) / 100);
    let new_price = data.unit_price + monto_ganancia;

    // Calcular margen de ganancia
    if (product.price == 0) {
      await Product.findByIdAndUpdate({ _id: data.product }, { price: new_price });
    } else {
      let actual_ganancia = product.stock * product.price;
      let nueva_ganancia = data.quantity * new_price;
      let total_price = actual_ganancia + nueva_ganancia;
      let total_stock = product.stock + data.quantity;
      let new_price2 = Math.round(total_price / total_stock);
      await Product.findByIdAndUpdate({ _id: data.product }, { price: new_price2 });
    }

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_inventory = async (req, res = response) => {
  let id = req.params["id"];

  try {
    let reg = await Inventory.findByIdAndDelete(id);

    // Actualizar stock general
    let product = await Product.findById(reg.product);
    let new_stock1 = product.stock - reg.quantity;
    await Product.findByIdAndUpdate({ _id: reg.product }, { stock: new_stock1 });

    // Actualizar stock variedad
    let variety = await Variety.findById(reg.variety);
    let new_stock2 = variety.stock - reg.quantity;
    await Variety.findByIdAndUpdate({ _id: reg.variety }, { stock: new_stock2 });

    // Buscar los registros de inventario del producto
    let pro = await Inventory.find({ product: reg.product });
    if (pro.length == 0) {
      await Product.findByIdAndUpdate({ _id: reg.product }, { price: 0 });
    } else {
      let calc_margin = 0;
      let calc_total = 0;
      let total_price = 0;
      let total_stock = 0;
      for (let item of pro) {
        calc_margin = Math.round((item.unit_price * item.earnings) / 100);
        calc_total = (item.unit_price + calc_margin) * item.quantity;
        total_price += calc_total;
        total_stock += item.quantity;
      }
      let new_price = Math.round(total_price / total_stock);
      await Product.findByIdAndUpdate({ _id: reg.product }, { price: new_price });
    }

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const list_inventory = async (req, res = response) => {
  try {
    let reg = await Inventory.find().sort({ created_at: -1 }).populate("product").populate("variety");
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const list_inventory_general = async (req, res = response) => {
  try {
    let reg = await Variety.find({ stock: { $gte: 1 } })
      .select("_id sku title stock updated_at")
      .populate({
        path: "product",
        select: "id_ title price type",
        populate: {
          path: "category",
          select: "id_ title",
        },
      });

    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const list_inventory_entry = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let reg = await Inventory.find()
      .select("id unit_price quantity created_at")
      .populate({ path: "variety", select: "_id title sku " })
      .populate({
        path: "product",
        select: "_id title",
        populate: {
          path: "category",
          select: "id_ title",
        },
      });

    if (month < 10) {
      month = "0" + month;
    }

    let inventory = [];
    for (let item of reg) {
      let _month = moment(item.created_at).format("MM");
      let _year = moment(item.created_at).format("YYYY");
      if (year == _year && month == "Todos") {
        inventory.push(item);
      } else if (year == _year && month == _month) {
        inventory.push(item);
      }
    }

    return res.json({ data: inventory, months: arr_months });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const list_inventory_exit = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let reg = await Sale_Detail.find()
      .select("id price quantity status created_at")
      .populate({ path: "variety", select: "_id title sku" })
      .populate({
        path: "product",
        select: "_id title",
        populate: {
          path: "category",
          select: "id_ title",
        },
      });

    if (month < 10) {
      month = "0" + month;
    }

    let inventory = [];
    for (let item of reg) {
      let _month = moment(item.created_at).format("MM");
      let _year = moment(item.created_at).format("YYYY");
      if (year == _year && month == "Todos") {
        if (item.status != "Cancelado") {
          inventory.push(item);
        }
      } else if (year == _year && month == _month) {
        if (item.status != "Cancelado") {
          inventory.push(item);
        }
      }
    }

    return res.json({ data: inventory, months: arr_months });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_product,
  read_products,
  read_product_by_id,
  update_product,
  delete_product,
  change_status,
  create_variety,
  read_varieties,
  read_variety_by_id,
  delete_variety,
  create_inventory,
  delete_inventory,
  list_inventory,
  list_inventory_general,
  list_inventory_entry,
  list_inventory_exit,
};
