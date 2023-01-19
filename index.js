require("dotenv").config();
const mongoose = require("mongoose");
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

mongoose.connect(process.env.MONGO_DB).then(() => console.log("DB Online"));


// Rutas API
app.get("/", (req, res) => res.json({ welcome: "Server online" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/seed", require("./routes/seed"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/prospects", require("./routes/prospects"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/kpis", require("./routes/kpis"));

app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/sales", require("./routes/sales"));

app.use("/api/courses", require("./routes/courses"));
app.use("/api/cycles", require("./routes/cycles"));
app.use("/api/inscriptions", require("./routes/inscriptions"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo Puerto: " + process.env.PORT);
});
