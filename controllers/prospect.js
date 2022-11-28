const { response } = require("express");
const { arr_months } = require("../utils/data");
const { create_activity } = require("../utils/helpers");
const { send_email_prospect } = require("../utils/email");
const moment = require("moment");

const Customer = require("../models/customer");
const Customer_Call = require("../models/prospect/customer_call");
const Customer_Mail = require("../models/prospect/customer_mail");
const Customer_Task = require("../models/prospect/customer_task");
const Customer_Activity = require("../models/prospect/customer_activity");

// Calls Customers
const create_call = async (req, res = response) => {
  let data = req.body;
  try {
    data.employee = req.id;
    let reg = await Customer_Call.create(data);
    create_activity("Llamada", "Se registro una llamada " + data.result, data.customer, data.employee);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_calls = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Call.find({ customer: id }).populate("employee").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_call = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Call.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Mails Customers
const create_mail = async (req, res = response) => {
  let data = req.body;
  try {
    data.employee = req.id;
    let customer = await Customer.findById({ _id: data.customer });
    let reg = await Customer_Mail.create(data);
    create_activity("Correo", "Se envió un correo con el asunto: " + data.subject, data.customer, data.employee);
    send_email_prospect(customer.full_name, data.subject, customer.email, data.message);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_mails = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Mail.find({ customer: id }).populate("employee").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_mail = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Mail.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Taks Customers
const create_task = async (req, res = response) => {
  let data = req.body;
  try {
    let reg = await Customer_Task.create(data);
    create_activity("Tarea", "Se registro una tarea como " + data.title, data.customer, req.id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const read_tasks = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Task.find({ customer: id }).populate("employee").populate("employee_make").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const delete_task = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Task.findByIdAndDelete(id);
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const make_task = async (req, res = response) => {
  let id = req.params["id"];
  try {
    var date_now = new Date();
    let reg = await Customer_Task.findByIdAndUpdate({ _id: id }, { status: true, employee_date: date_now, employee_make: req.id });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Activities Customers
const list_activities = async (req, res = response) => {
  let id = req.params["id"];
  try {
    let reg = await Customer_Activity.find({ customer: id }).populate("employee").sort({ created_at: -1 });
    return res.json({ data: reg });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

// Activities Customers
const kpis_prospect = async (req, res = response) => {
  let id = req.params["id"];
  let first_day = moment().startOf("year");
  let last_day = moment().endOf("year");
  var arr_calls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var arr_mails = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var arr_tasks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var activities = [0, 0, 0, 0];

  try {
    let calls = await Customer_Call.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      customer: id,
    });

    let mails = await Customer_Mail.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      customer: id,
    });

    let tasks = await Customer_Task.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      customer: id,
    });

    for (let item of calls) {
      let m = moment(item.created_at).format("M");
      for (let i = 1; i <= 12; i++) {
        if (m == i) {
          arr_calls[i - 1]++;
        }
      }
    }

    for (let item of mails) {
      let m = moment(item.created_at).format("M");
      for (let i = 1; i <= 12; i++) {
        if (m == i) {
          arr_mails[i - 1]++;
        }
      }
    }

    for (let item of tasks) {
      let m = moment(item.created_at).format("M");
      for (let i = 1; i <= 12; i++) {
        if (m == i) {
          arr_tasks[i - 1]++;
        }
      }
    }

    let sum = calls.length + tasks.length + mails.length;
    activities = [sum, calls.length, tasks.length, mails.length];

    return res.json({ data: activities, arr_calls, arr_mails, arr_tasks, arr_months });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = {
  create_call,
  create_mail,
  create_task,
  read_calls,
  read_mails,
  read_tasks,
  delete_call,
  delete_mail,
  delete_task,
  make_task,
  list_activities,
  kpis_prospect,
};
