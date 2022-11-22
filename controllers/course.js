const { response } = require("express");
const { uploadImage, deleteImage } = require("../middlewares/cloudinary");
const { generateSlug } = require("../utils/functions");
const Course = require("../models/matricula/course");
var fs = require("fs");

const create_course = async (req, res = response) => {
  let data = req.body;
  try {
    let exist_title = await Course.findOne({ title: data.title });
    if (exist_title) {
      if (req.files) {
        fs.unlinkSync(req.files.image.tempFilePath);
      }
      return res.json({ msg: "Este título ya se encuentra registrado." });
    } else {
      if (req.files) {
        const tempFilePath = req.files.image.tempFilePath;
        const { public_id, secure_url } = await uploadImage(tempFilePath, "courses");
        data.image = { public_id, secure_url };
        fs.unlinkSync(tempFilePath);
      }
      data.slug = generateSlug(data.title);
      let reg = await Course.create(data);
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_courses = async (req, res = response) => {
  let reg = await Course.find().sort({ title: 1 });
  return res.json({ data: reg });
};

const read_course_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Course.findById(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_course = async (req, res = response) => {
  let id = req.params["id"];

  try {
    const course = await Course.findById(id);
    const { title, ...data } = req.body;

    if (course.title != title) {
      let exist_title = await Course.findOne({ title });
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
      const { public_id, secure_url } = await uploadImage(tempFilePath, "courses");
      data.image = { public_id, secure_url };
      fs.unlinkSync(tempFilePath);
      if (course.image.public_id) {
        await deleteImage(course.image.public_id);
      }
    }
    let reg = await Course.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_course = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Course.findByIdAndDelete(id);
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
    reg = await Course.findByIdAndUpdate(id, { status });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_course,
  read_courses,
  read_course_by_id,
  update_course,
  delete_course,
  change_status,
};
