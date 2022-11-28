const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { tempUpload } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/customer");
const router = Router();

router.post("/login_customer", ctrl.login_customer);
router.get("/read_customers/:filter?", [validateJWT], ctrl.read_customers);
router.get("/read_customer_by_id/:id", [validateJWT], ctrl.read_customer_by_id);
router.post("/create_customer", [validateJWT, tempUpload], ctrl.create_customer);
router.put("/update_customer/:id", [validateJWT, tempUpload], ctrl.update_customer);
router.delete("/delete_customer/:id", [validateJWT], ctrl.delete_customer);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

module.exports = router;
