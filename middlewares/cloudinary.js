const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const uploadPath = fileUpload({
  useTempFiles: true,
  tempFileDir: "uploads",
});

const uploadImage = async (filePath, folderName) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "business/" + folderName,
    format: "webp",
    width: "600",
  });
};

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadPath,
  uploadImage,
  deleteImage,
};
