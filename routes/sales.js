const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/sale");
const router = Router();

//[ http://localhost:3000/api/sales ]
router.post("/create_sale", [validateJWT], ctrl.create_sale);
router.put("/pass_sale/:id", [validateJWT], ctrl.pass_sale);
router.put("/accept_sale/:id", [validateJWT], ctrl.accept_sale);
router.put("/cancel_sale/:id", [validateJWT], ctrl.cancel_sale);
router.get("/read_sales_by_id/:id", [validateJWT], ctrl.read_sales_by_id);
router.get("/read_sales_today", [validateJWT], ctrl.read_sales_today);
router.get("/read_sales_dates/:employee/:from?/:to?", [validateJWT], ctrl.read_sales_dates);

module.exports = router;
