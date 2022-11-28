const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { tempUpload } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/course");
const router = Router();

//[ http://localhost:3000/api/products ]
router.post("/create_course", [validateJWT, tempUpload], ctrl.create_course);
router.get("/read_courses", [validateJWT], ctrl.read_courses);
router.get("/read_course_by_id/:id", [validateJWT], ctrl.read_course_by_id);
router.put("/update_course/:id", [validateJWT, tempUpload], ctrl.update_course);
router.delete("/delete_course/:id", [validateJWT], ctrl.delete_course);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

module.exports = router;
