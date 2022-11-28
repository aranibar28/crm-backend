const file_upload = async (req, res = response) => {
  const type = req.params.type;
  const id = req.params.id;

  // Validar tipo
  const typeValids = ["employees", "customers", "products", "categories"];
  if (!typeValids.includes(type)) {
    return res.json({ msg: "No es un categoría válida de imagen." });
  }

  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.json({ msg: "No hay ningún archivo" });
  }

  if (req.files) {
    const tempFilePath = req.files.image.tempFilePath;
    const { public_id, secure_url } = await uploadImage(tempFilePath, type);
    const result = { public_id, secure_url };
    let data = {};
    let reg = {};

    switch (type) {
      case "employees":
        data = await Employee.findById(id);
        if (!data) {
          console.log("No existe el id");
          return false;
        }
        if (data.image.public_id) {
          await deleteImage(data.image.public_id);
        }
        reg = await Employee.findByIdAndUpdate(id, { image: result }, { new: true });
        return res.json({ data: reg });
        break;

      case "customers":
        data = await Customer.findById(id);
        if (!data) {
          console.log("No existe el id");
          return false;
        }
        if (data.image.public_id) {
          await deleteImage(data.image.public_id);
        }
        reg = await Customer.findByIdAndUpdate(id, { image: result }, { new: true });
        return res.json({ data: reg });
        break;
    }
    fs.unlinkSync(tempFilePath);
  }
};
