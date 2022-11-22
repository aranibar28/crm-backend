const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const { admin, company, categories, products, courses, customer } = require("../utils/data");
var fs = require("fs");

const Employee = require("../models/employee");
const Customer = require("../models/customer");
const Company = require("../models/company");
const Category = require("../models/ecommerce/category");
const Product = require("../models/ecommerce/product");
const Course = require("../models/matricula/course");

const seed_data = async (req, res = response) => {
  try {
    let exist = await Employee.find();
    if (!exist.length) {
      let reg = await Employee.create(admin);
      await Company.create(company);
      await Customer.create(customer);
      await Category.create(categories);
      await Product.create(products);
      await Course.create(courses);
      return res.json({ data: reg });
    } else {
      return res.json({ msg: "Ya existe una data." });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const get_company = async (req, res = response) => {
  try {
    let reg = await Company.findById(company._id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_company = async (req, res = response) => {
  let id = company._id;
  let data = req.body;

  try {
    if (req.files) {
      data.channels = JSON.parse(data.channels);
      data.varieties = JSON.parse(data.varieties);
      const tempFilePath = req.files.logo.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, "company");
      data.logo = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
    }
    let reg = await Company.findByIdAndUpdate(id, data);
    if (reg.logo.public_id) {
      await deleteImage(reg.logo.public_id);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  seed_data,
  get_company,
  update_company,
};
