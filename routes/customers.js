const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { uploadPath } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/customer");
const router = Router();

//[ http://localhost:3000/api/customers ]
router.post("/login_customer", ctrl.login_customer);
router.post("/create_customer", [validateJWT, uploadPath], ctrl.create_customer);
router.get("/read_customers/:filter?", [validateJWT], ctrl.read_customers);
router.get("/read_customer_by_id/:id", [validateJWT], ctrl.read_customer_by_id);
router.put("/update_customer/:id", [validateJWT, uploadPath], ctrl.update_customer);
router.delete("/delete_customer/:id", [validateJWT], ctrl.delete_customer);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

module.exports = router;
