const { response } = require("express");
const { register_activity, update_type_prospect } = require("../utils/helpers");
const { send_email_invoice } = require("../utils/email");

const Inscription = require("../models/matricula/inscription");
const Inscription_Detail = require("../models/matricula/inscription_detail");
const Inscription_Comment = require("../models/matricula/inscription_comments");
const Cycle_Room = require("../models/matricula/cycle_room");
const Payment = require("../models/payments");
const moment = require("moment");

const create_inscription = async (req, res = response) => {
  let data = req.body;
  try {
    // Buscar duplicidad de usuarios matriculados.
    let my_array = [];
    for (let item of data.details) {
      let details = await Inscription_Detail.findOne({ course: item.course, customer: data.customer }).populate("course");
      if (details) {
        my_array.push(details?.course.title); // Obtener titulos de los cursos.
      }
    }

    if (my_array.length == 0) {
      data.employee = req.id;
      let reg = await Inscription.create(data);

      for (let item of data.details) {
        item.employee = req.id;
        item.customer = data.customer;
        item.inscription = reg._id;
        await Inscription_Detail.create(item);
        update_aforo(item.cycle_room);
      }
      register_activity("Se registró la matrícula del cliente", req.id, reg._id);
      update_type_prospect(reg.customer);
      return res.json({ data: reg });
    } else {
      return res.json({ msg: "El cliente ya se encuentra matriculado en los siguientes cursos: " + my_array.join(" - ") });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_inscriptions_today = async (req, res = response) => {
  try {
    let reg = await Inscription.find().populate("customer").populate("employee").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_inscriptions_dates = async (req, res = response) => {
  try {
    let employee = req.params["employee"];
    let from = req.params["from"];
    let to = req.params["to"];
    let reg = [];

    const start = moment(from).startOf("day");
    const end = moment(to).endOf("day");

    if (employee == "all") {
      reg = await Inscription.find({
        created_at: {
          $gte: start,
          $lte: end,
        },
      })
        .populate("customer")
        .populate("employee")
        .sort({ created_at: -1 });
    } else {
      reg = await Inscription.find({
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

const read_inscription_by_id = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let inscription = await Inscription.findById(id).populate("customer").populate("employee");
    let details = await Inscription_Detail.find({ inscription: id }).populate("course").populate("cycle_course").populate("cycle_room");
    return res.json({ data: inscription, details: details });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const send_invoice = async (req, res = response) => {
  let id = req.params["id"];
  send_email_invoice(id);
  register_activity("El reenvió la orden al cliente", req.id, id);
  return res.status(200).send({ data: true });
};

const firm_inscription = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  try {
    await Inscription.findByIdAndUpdate(id, {
      firm: data.firm,
      date_firm: Date.now(),
    });
    register_activity("Se registro la firma del contrato.", req.id, id);
    return res.json({ data: true });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const cancel_inscription = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Inscription.findByIdAndUpdate(id, { status: "Cancelado" });

    let details = await Inscription_Detail.find({ inscription: id });
    for (let item of details) {
      cancel_aforo(item.cycle_room);
    }

    await Inscription_Detail.updateMany({ inscription: id }, { status: "Cancelado" });
    await Payment.updateMany({ inscription: id }, { status: "Cancelado" });
    register_activity("Se canceló la matrícula.", req.id, id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const accept_inscription = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Inscription.findByIdAndUpdate(id, { status: "Procesando" });

    let details = await Inscription_Detail.find({ inscription: id });
    for (let item of details) {
      update_aforo(item.cycle_room);
    }

    await Inscription_Detail.updateMany({ inscription: id }, { status: "Procesando" });
    await Payment.updateMany({ inscription: id }, { status: "Procesando" });
    register_activity("Se activó la matrícula", req.id, id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const pass_inscription = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Inscription.findByIdAndUpdate(id, { status: "Aprobado" });
    await Inscription_Detail.updateMany({ inscription: id }, { status: "Aprobado" });
    await Payment.updateMany({ inscription: id }, { status: "Aprobado" });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const list_comments = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Inscription_Comment.find({ inscription: id }).sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

////////////////////////////////////////////////////////

const update_aforo = async (id) => {
  try {
    let room = await Cycle_Room.findById(id);
    let new_aforo = room.students + 1;
    await Cycle_Room.findByIdAndUpdate(id, { students: new_aforo });
  } catch (error) {
    return;
  }
};

const cancel_aforo = async (id) => {
  try {
    let room = await Cycle_Room.findById(id);
    let new_aforo = room.students - 1;
    await Cycle_Room.findByIdAndUpdate(id, { students: new_aforo });
  } catch (error) {
    return;
  }
};

module.exports = {
  create_inscription,
  read_inscriptions_today,
  read_inscriptions_dates,
  read_inscription_by_id,
  send_invoice,
  firm_inscription,
  cancel_inscription,
  accept_inscription,
  pass_inscription,
  list_comments,
};
