const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { validateADMIN } = require("../middlewares/authorized");
const { tempUpload } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/employee");
const router = Router();

router.post("/login_employee", ctrl.login_employee);
router.get("/renew", [validateJWT], ctrl.renew_token);
router.get("/read_employees", [validateJWT], ctrl.read_employees);
router.get("/read_employee_by_id/:id", [validateJWT], ctrl.read_employee_by_id);
router.post("/create_employee", [validateJWT, validateADMIN, tempUpload], ctrl.create_employee);
router.put("/update_employee/:id", [validateJWT, tempUpload], ctrl.update_employee);
router.delete("/delete_employee/:id", [validateJWT, validateADMIN], ctrl.delete_employee);
router.put("/change_status/:id", [validateJWT, validateADMIN], ctrl.change_status);

module.exports = router;
