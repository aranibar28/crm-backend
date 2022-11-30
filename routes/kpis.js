const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/kpi");
const router = Router();

//[ http://localhost:3000/api/kpi ]
router.get("/kpi_widgets", [validateJWT], ctrl.kpi_widgets);
router.get("/kpi_month_payments", [validateJWT], ctrl.kpi_month_payments);
router.get("/kpi_month_type/:year/:month", [validateJWT], ctrl.kpi_month_type);
router.get("/kpi_month_method/:year/:month", [validateJWT], ctrl.kpi_month_method);
router.get("/kpi_course_earnings/:year/:month", [validateJWT], ctrl.kpi_course_earnings);
router.get("/kpi_product_earnings/:year/:month", [validateJWT], ctrl.kpi_product_earnings);
router.get("/kpi_month_prospects", [validateJWT], ctrl.kpi_month_prospects);
router.get("/kpi_genre_prospects", [validateJWT], ctrl.kpi_genre_prospects);
router.get("/kpi_top_customers", [validateJWT], ctrl.kpi_top_customers);
router.get("/kpi_top_products", [validateJWT], ctrl.kpi_top_products);
router.get("/kpi_top_courses", [validateJWT], ctrl.kpi_top_courses);

module.exports = router;
