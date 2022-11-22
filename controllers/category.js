const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const Category = require("../models/ecommerce/category");
var fs = require("fs");

const create_category = async (req, res = response) => {
  let data = req.body;
  try {
    if (req.files) {
      const tempFilePath = req.files.image.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, "category");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
    }
    let reg = await Category.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_categories = async (req, res = response) => {
  let reg = await Category.find().sort({ created_at: -1 });
  return res.json({ data: reg });
};

const read_category_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Category.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_category = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;

  try {
    const category = await Category.findById(id);
    if (req.files) {
      const tempFilePath = req.files.image.tempFilePath;
      const { public_id, secure_url } = await uploadImage(tempFilePath, "category");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
      if (category.image.public_id) {
        await deleteImage(category.image.public_id);
      }
    }
    let reg = await Category.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_category = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Category.findByIdAndDelete(id);
    if (reg.image.public_id) {
      await deleteImage(reg.image.public_id);
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const change_status = async (req, res = response) => {
  let id = req.params["id"];
  let { status } = req.body;
  try {
    reg = await Category.findByIdAndUpdate(id, { status });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_category,
  read_categories,
  read_category_by_id,
  update_category,
  delete_category,
  change_status,
};
