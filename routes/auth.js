const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const ctrl = require("../controllers/employee");
const router = Router();

router.post("/login", ctrl.login_employee);
router.get("/renew_token", [validateJWT], ctrl.renew_token);

module.exports = router;
