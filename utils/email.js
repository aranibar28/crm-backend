const Customer = require("../models/customer");
const Company = require("../models/company");
const Inscription = require("../models/matricula/inscription");
const Inscription_Detail = require("../models/matricula/inscription_detail");
const jwt = require("./jwt");
const moment = require("moment");

var fs = require("fs");
var handlebars = require("handlebars");
var ejs = require("ejs");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const send_email_verify = async (email) => {
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })
  );

  //OBTENER CLIENTE
  var customer = await Customer.findOne({ email });
  var token = await jwt.createTokenPublic(customer);

  readHTMLFile(process.cwd() + "/mails/account_verify.html", (err, html) => {
    let rest_html = ejs.render(html, { token });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verificación de cuenta.",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

const send_email_invoice = async (id) => {
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    })
  );

  //OBTENER MATRICULA
  let company = await Company.findOne();
  let inscription = await Inscription.findById(id).populate("customer").populate("employee");
  let details = await Inscription_Detail.find({ inscription: id }).populate("course").populate("cycle_course").populate("cycle_room");
  let created_at = moment(inscription.created_at).format("DD/MM/YYYY");

  readHTMLFile(process.cwd() + "/mails/electronic_invoice.html", (err, html) => {
    let rest_html = ejs.render(html, { company, inscription, details, created_at });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: process.env.EMAIL,
      to: inscription.customer.email,
      subject: "Orden de Matrícula",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

const send_email_prospect = async (customer, subject, email, message) => {
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    })
  );

  //OBTENER CLIENTE
  var customer = await Customer.findOne({ email });

  readHTMLFile(process.cwd() + "/mails/mail_message.html", (err, html) => {
    let rest_html = ejs.render(html, { cliente: customer.full_name, asunto: subject, email: email, contenido: message });

    var template = handlebars.compile(rest_html);
    var htmlToSend = template({ op: true });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (!error) {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

module.exports = {
  send_email_verify,
  send_email_invoice,
  send_email_prospect,
};
