const { response } = require("express");
const { getMonths } = require("../utils/functions");
const Course = require("../models/matricula/course");
const Cycle_Course = require("../models/matricula/cycle_course");
const Cycle_Instructor = require("../models/matricula/cycle_instructor");
const Cycle_Room = require("../models/matricula/cycle_room");
var moment = require("moment");

const create_cycle = async (req, res = response) => {
  let data = req.body;
  try {
    let start_format = moment(data.start_date).startOf("day");
    let final_format = moment(data.final_date).endOf("day");
    let start_month = start_format.month() + 1;
    let final_month = final_format.month() + 1;
    data.months = getMonths(start_month, final_month);

    // Calcular fecha de inscripción
    data.inscription = moment(start_format).subtract(14, "days").format("YYYY-MM-DD");
    data.year = start_format.year();
    data.employee = req.id;

    let reg = await Cycle_Course.create(data);

    // Crear salones automáticamente
    let rooms = data.frequency;
    for (var item of rooms) {
      await Cycle_Room.create({
        room: item.room,
        frequency: item.frequency,
        start_time: item.start_time,
        final_time: item.final_time,
        aforo: item.aforo,
        course: data.course,
        cycle_course: reg._id,
      });
    }
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_current_cycles = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let year = moment().year();
    let today_format = moment().unix();
    let cycles = await Cycle_Course.find({ course: id, year }).populate("course");
    var arr_cycles = [];

    for (var item of cycles) {
      let start_format = moment(item.inscription).unix();
      let final_format = moment(item.final_date).unix();
      if ((today_format >= start_format && today_format <= final_format) || today_format < final_format) {
        let rooms = await Cycle_Room.find({ cycle_course: item._id });
        for (let subitem of rooms) {
          let fx = await Cycle_Instructor.findOne({ cycle_room: subitem._id }).populate("employee");
          if (fx) {
            subitem.instructor = fx.employee?.full_name;
          }
        }
        arr_cycles.push({
          cycle: item,
          rooms: rooms,
        });
      }
    }
    return res.json({ data: arr_cycles });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_expired_cycles = async (req, res = response) => {
  try {
    let id = req.params["id"];

    let year = moment().year();
    let today_format = moment().unix();

    let cycles = await Cycle_Course.find({ course: id, year }).populate("course");
    var arr_cycles = [];

    for (var item of cycles) {
      let final_format = moment(item.final_date).unix();

      if (today_format >= final_format) {
        let rooms = await Cycle_Room.find({ cycle_course: item._id });
        for (let subitem of rooms) {
          let fx = await Cycle_Instructor.findOne({ cycle_room: subitem._id }).populate("employee");
          if (fx) {
            subitem.instructor = fx.employee.full_name;
          }
        }
        arr_cycles.push({
          cycle: item,
          rooms: rooms,
        });
      }
    }
    return res.json({ data: arr_cycles });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_cycle_by_id = async (req, res = response) => {
  let id_course = req.params["id"];
  let id_cycle = req.params["id_cycle"];

  try {
    let course = await Course.findById(id_course);
    try {
      let cycle = await Cycle_Course.findById({ _id: id_cycle });
      let rooms = await Cycle_Room.find({ cycle_course: id_cycle });
      return res.json({ data: course, cycle, rooms });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const update_cycle = async (req, res = response) => {
  let id = req.params["id"];
  let data = req.body;
  try {
    // Calcular fecha de inscripción
    let start_format = moment(data.start_date).startOf("day");
    let final_format = moment(data.final_date).endOf("day");
    let start_month = start_format.month() + 1;
    let final_month = final_format.month() + 1;

    // Obtener meses entre dos rangos de fechas
    let arr_months = [];
    if (start_month != final_month) {
      if (start_month >= final_month) {
        for (let i = start_month; i <= 12; i++) {
          arr_months.push(i);
        }
        for (let i = 1; i <= final_month; i++) {
          arr_months.push(i);
        }
      } else {
        for (let i = start_month; i <= final_month; i++) {
          arr_months.push(i);
        }
      }
    } else {
      arr_months.push(start_month);
    }

    // Calcular fecha de inscripción
    data.inscription = moment(start_format).subtract(14, "days").format("YYYY-MM-DD");

    data.months = arr_months;
    data.year = start_format.year();

    let reg = await Cycle_Course.findByIdAndUpdate(id, data, { new: true });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_cycle = async (req, res = response) => {
  let id = req.params["id"];

  try {
    let existStudents = 0;
    let fx = await Cycle_Room.find({ cycle_course: id });
    for (let item of fx) {
      existStudents += item.students;
    }

    if (existStudents >= 1) {
      return res.json({ msg: "Hay alumnos matriculados en este curso." });
    } else {
      let reg = await Cycle_Course.findByIdAndDelete(id);
      await Cycle_Room.deleteMany({ cycle_course: id });
      await Cycle_Instructor.deleteMany({ cycle_course: id });
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const change_status_cycle = async (req, res = response) => {
  let id = req.params["id"];
  let { status } = req.body;
  try {
    reg = await Cycle_Course.findByIdAndUpdate(id, { status });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const add_rooms_cycle = async (req, res = response) => {
  let data = req.body;
  try {
    let reg = await Cycle_Room.create(data);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const del_rooms_cycle = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let existStudents = await Cycle_Room.findById(id);
    if (existStudents.students >= 1) {
      return res.json({ msg: "Hay alumnos matriculados en este curso." });
    } else {
      let reg = await Cycle_Room.findByIdAndDelete(id);
      await Cycle_Instructor.deleteMany({ cycle_room: reg._id });
      return res.json({ data: true });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// ASIGNAR INSTRUCTORES A UN SALÓN

const list_instructors_room = async (req, res = response) => {
  let id = req.params["id"];
  try {
    reg = await Cycle_Instructor.find({ cycle_course: id }).populate("employee").populate("cycle_room");
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const add_instructor_room = async (req, res = response) => {
  let data = req.body;
  try {
    existInstructor = await Cycle_Instructor.findOne({ cycle_room: data.cycle_room });

    if (existInstructor) {
      return res.json({ msg: "Ya existe un instructor en este salón" });
    } else {
      reg = await Cycle_Instructor.create(data);
      await Cycle_Room.findByIdAndUpdate({ _id: reg.cycle_room }, { status: true });
      return res.json({ data: reg });
    }
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const del_instructor_room = async (req, res = response) => {
  let id = req.params["id"];
  try {
    reg = await Cycle_Instructor.findByIdAndDelete(id);
    await Cycle_Room.findByIdAndUpdate({ _id: reg.cycle_room }, { status: false });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_cycle,
  read_cycle_by_id,
  read_current_cycles,
  read_expired_cycles,
  update_cycle,
  delete_cycle,
  change_status_cycle,
  add_rooms_cycle,
  del_rooms_cycle,
  list_instructors_room,
  add_instructor_room,
  del_instructor_room,
};
