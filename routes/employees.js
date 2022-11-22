const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { uploadPath } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/employee");
const router = Router();

//[ http://localhost:3000/api/employees ]
router.post("/login_employee", ctrl.login_employee);
router.post("/create_employee", [validateJWT, uploadPath], ctrl.create_employee);
router.get("/read_employees", [validateJWT], ctrl.read_employees);
router.get("/read_employee_by_id/:id", [validateJWT], ctrl.read_employee_by_id);
router.put("/update_employee/:id", [validateJWT, uploadPath], ctrl.update_employee);
router.delete("/delete_employee/:id", [validateJWT], ctrl.delete_employee);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

module.exports = router;
