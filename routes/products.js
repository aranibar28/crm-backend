const { Router } = require("express");
const { validateJWT } = require("../middlewares/authenticated");
const { uploadPath } = require("../middlewares/cloudinary");
const ctrl = require("../controllers/product");
const router = Router();

//[ http://localhost:3000/api/products ]
router.post("/create_product", [validateJWT, uploadPath], ctrl.create_product);
router.get("/read_products", [validateJWT], ctrl.read_products);
router.get("/read_product_by_id/:id", [validateJWT], ctrl.read_product_by_id);
router.put("/update_product/:id", [validateJWT, uploadPath], ctrl.update_product);
router.delete("/delete_product/:id", [validateJWT], ctrl.delete_product);
router.put("/change_status/:id", [validateJWT], ctrl.change_status);

router.post("/create_variety/:id", [validateJWT], ctrl.create_variety);
router.get("/read_varieties", [validateJWT], ctrl.read_varieties);
router.get("/read_variety_by_id/:id", [validateJWT], ctrl.read_variety_by_id);
router.delete("/delete_variety/:id", [validateJWT], ctrl.delete_variety);

router.post("/create_inventory", [validateJWT], ctrl.create_inventory);
router.delete("/delete_inventory/:id", [validateJWT], ctrl.delete_inventory);
router.get("/list_inventory", [validateJWT], ctrl.list_inventory);
router.get("/list_inventory_general", [validateJWT], ctrl.list_inventory_general);
router.get("/list_inventory_entry/:year/:month", [validateJWT], ctrl.list_inventory_entry);
router.get("/list_inventory_exit/:year/:month", [validateJWT], ctrl.list_inventory_exit);

module.exports = router;
