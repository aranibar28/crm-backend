const { response } = require("express");
const { arr_months } = require("../utils/data");
const moment = require("moment");

const Customer = require("../models/customer");
const Payment = require("../models/payments");

const Product = require("../models/ecommerce/product");
const Sale = require("../models/ecommerce/sale");
const Sale_Detail = require("../models/ecommerce/sale_detail");

const Course = require("../models/matricula/course");
const Inscription = require("../models/matricula/inscription");
const Inscription_Detail = require("../models/matricula/inscription_detail");

const kpi_month_payments = async (req, res = response) => {
  var arr_amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var earnings_year = 0;
  var earnings_month = 0;
  var earnings_month_past = 0;

  var count_sales = 0;
  var count_sales_past = 0;

  var count_inscriptions = 0;
  var count_inscriptions_past = 0;

  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");
    let current_month = moment().format("M");
    let past_month = moment().format("M");

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    });

    for (let item of payments) {
      let m = moment(item.created_at).format("M");
      for (let i = 1; i <= 12; i++) {
        if (m == i) {
          arr_amounts[i - 1] += item.amount;
        }
      }

      if (m == current_month) {
        earnings_month += item.amount;
      }

      if (m == Number(past_month) - 1) {
        earnings_month_past += item.amount;
      }

      earnings_year += item.amount;
    }

    let sales = await Sale.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    });

    for (let item of sales) {
      let m = moment(item.created_at).format("M");
      if (m == current_month) {
        count_sales++;
      }
      if (m == Number(past_month) - 1) {
        count_sales_past++;
      }
    }

    let inscriptions = await Inscription.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    });

    for (let item of inscriptions) {
      let m = moment(item.created_at).format("M");
      if (m == current_month) {
        count_inscriptions++;
      }
      if (m == Number(past_month) - 1) {
        count_inscriptions_past++;
      }
    }

    return res.json({
      arr_months,
      arr_amounts,
      widgets: {
        earnings_year,
        earnings_month,
        earnings_month_past,
        count_sales,
        count_sales_past,
        count_inscriptions,
        count_inscriptions_past,
      },
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_month_type = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let format = year + "-" + month + "-01";
    let first_day = moment(format).startOf("month");
    let last_day = moment(format).endOf("month");

    let amount_matricula = 0;
    let amount_venta = 0;

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    });

    for (let item of payments) {
      if (item.type == "Matricula") {
        amount_matricula += item.amount;
      } else if (item.type == "Venta") {
        amount_venta += item.amount;
      }
    }

    return res.json({ data: [amount_venta, amount_matricula] });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_month_method = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let format = year + "-" + month + "-01";
    let first_day = moment(format).startOf("month");
    let last_day = moment(format).endOf("month");

    let arr_method = ["Transferencia", "Depósito", "Paypal", "Tarjeta Crédito"];
    let arr_amount = [0, 0, 0, 0];

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    });

    for (let item of payments) {
      for (let i = 0; i < arr_method.length; i++) {
        if (item.method == arr_method[i]) {
          arr_amount[i] += item.amount;
        }
      }
    }

    return res.json({ data: arr_amount });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_course_earnings = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let format = year + "-" + month + "-01";
    let first_day = moment(format).startOf("month");
    let last_day = moment(format).endOf("month");

    let courses = await Course.find();
    let arr_courses = [];
    let arr_amounts = [];

    for (let item of courses) {
      arr_courses.push(item.title);
    }

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      type: "Matricula",
      status: { $in: ["Aprobado", "Procesando"] },
    }).populate({ path: "inscription_detail", populate: { path: "course" } });

    for (let item of courses) {
      let amount = 0;
      var matricula = 0;

      for (let subitem of payments) {
        if (item.title == subitem.inscription_detail?.course.title) {
          amount += subitem.amount;
        }

        if (!subitem.inscription_detail) {
          matricula += subitem.amount;
        }
      }
      arr_amounts.push(amount);
    }
    arr_amounts.push(matricula);
    arr_courses.push("Recaudación Matrículas");
    return res.json({ arr_courses, arr_amounts });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_product_earnings = async (req, res = response) => {
  let year = req.params["year"];
  let month = req.params["month"];

  try {
    let format = year + "-" + month + "-01";
    let first_day = moment(format).startOf("month");
    let last_day = moment(format).endOf("month");
    let arr_products = [];
    let arr_amounts = [];

    let products = await Product.find();

    for (let item of products) {
      arr_products.push(item.title);
    }

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      type: "Venta",
      status: { $in: ["Aprobado", "Procesando"] },
    }).populate({ path: "sale_detail", populate: { path: "product" } });

    for (let item of products) {
      let amount = 0;
      for (let subitem of payments) {
        if (item.title == subitem.sale_detail.product.title) {
          amount += subitem.amount;
        }
      }
      arr_amounts.push(amount);
    }

    return res.json({ arr_products, arr_amounts });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_month_prospects = async (req, res = response) => {
  let arr_counts1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let arr_counts2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");

    let customers = await Customer.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
    });

    for (let item of customers) {
      let m = moment(item.created_at).format("M");
      for (let i = 0; i <= arr_months.length; i++) {
        if (item.type == "Prospecto" && m == i + 1) {
          arr_counts1[i]++;
        } else if (item.type == "Cliente" && m == i + 1) {
          arr_counts2[i]++;
        }
      }
    }

    return res.json({ arr_months, arr_counts1, arr_counts2 });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_genre_prospects = async (req, res = response) => {
  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");
    let genre = [0, 0];

    let customers = await Customer.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
    });

    for (let item of customers) {
      if (item.genre == "Masculino") {
        genre[0]++;
      } else if (item.genre == "Femenino") {
        genre[1]++;
      }
    }

    return res.json({ genre });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_top_customers = async (req, res = response) => {
  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");
    let arr_customer = [];
    let arr_amounts = [];

    let customers = await Customer.find();

    for (let item of customers) {
      arr_customer.push(item.full_name);
    }

    let payments = await Payment.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    }).populate("customer");

    for (let i = 0; i < arr_customer.length; i++) {
      let amount = 0;
      for (let subitem of payments) {
        if (arr_customer[i] === subitem.customer?.full_name) {
          amount += subitem.amount;
        }
      }
      arr_amounts.push(amount);
    }

    const merged = arr_customer.map((item, i) => {
      return {
        datalabel: arr_customer[i],
        datapoint: arr_amounts[i],
      };
    });

    const dataSort = merged.sort((a, b) => {
      return b.datapoint - a.datapoint;
    });

    const dl = [];
    const dp = [];

    for (let i = 0; i < 10; i++) {
      if (dataSort[i]) {
        dl.push(dataSort[i].datalabel.split(" "));
        dp.push(dataSort[i].datapoint);
      } else {
        dl.push("-");
        dp.push(0);
      }
    }

    return res.json({ arr_customer: dl, arr_amounts: dp });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_top_products = async (req, res = response) => {
  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");
    let arr_products = [];
    let arr_counts = [];

    let products = await Product.find();

    for (let item of products) {
      arr_products.push(item.title);
    }

    let payments = await Sale_Detail.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    }).populate("product");

    for (let i = 0; i < arr_products.length; i++) {
      let count = 0;
      for (let subitem of payments) {
        if (arr_products[i] === subitem.product.title) {
          count += subitem.quantity;
        }
      }
      arr_counts.push(count);
    }

    const merged = arr_products.map((item, i) => {
      return {
        datalabel: arr_products[i],
        datapoint: arr_counts[i],
      };
    });

    const dataSort = merged.sort((a, b) => {
      return b.datapoint - a.datapoint;
    });

    const dl = [];
    const dp = [];

    for (let i = 0; i < 5; i++) {
      if (dataSort[i]) {
        dl.push(dataSort[i].datalabel.split(" "));
        dp.push(dataSort[i].datapoint);
      } else {
        dl.push("-");
        dp.push(0);
      }
    }

    return res.json({ arr_products: dl, arr_counts: dp });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

const kpi_top_courses = async (req, res = response) => {
  try {
    let first_day = moment().startOf("year");
    let last_day = moment().endOf("year");
    let arr_courses = [];
    let arr_counts = [];

    let courses = await Course.find();

    for (let item of courses) {
      arr_courses.push(item.title);
    }

    let payments = await Inscription_Detail.find({
      created_at: {
        $gte: first_day,
        $lte: last_day,
      },
      status: { $in: ["Aprobado", "Procesando"] },
    }).populate("course cycle_room");

    for (let i = 0; i < arr_courses.length; i++) {
      let count = 0;
      for (let subitem of payments) {
        if (arr_courses[i] === subitem.course.title) {
          count += subitem.cycle_room?.students || 1;
        }
      }
      arr_counts.push(count);
    }

    const merged = arr_courses.map((item, i) => {
      return {
        datalabel: arr_courses[i],
        datapoint: arr_counts[i],
      };
    });

    const dataSort = merged.sort((a, b) => {
      return b.datapoint - a.datapoint;
    });

    const dl = [];
    const dp = [];

    for (let i = 0; i < 5; i++) {
      if (dataSort[i]) {
        dl.push(dataSort[i].datalabel.split(" "));
        dp.push(dataSort[i].datapoint);
      } else {
        dl.push("-");
        dp.push(0);
      }
    }

    return res.json({ arr_courses: dl, arr_counts: dp });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};
module.exports = {
  kpi_month_payments,
  kpi_month_type,
  kpi_month_method,
  kpi_course_earnings,
  kpi_product_earnings,
  kpi_month_prospects,
  kpi_genre_prospects,
  kpi_top_customers,
  kpi_top_products,
  kpi_top_courses,
};
