const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { uploadPath } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/category");
const router = Router();

//[ http://localhost:3000/api/categories ]
router.post("/create_category", [validateJWT, uploadPath], ctrl.create_category);
router.get("/read_categories", [validateJWT], ctrl.read_categories);
router.get("/read_category_by_id/:id", [validateJWT], ctrl.read_category_by_id);
router.put("/update_category/:id", [validateJWT, uploadPath], ctrl.update_category);
router.delete("/delete_category/:id", [validateJWT], ctrl.delete_category);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

module.exports = router;
