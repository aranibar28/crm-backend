const { Router } = require("express");
const ctrlSeed = require("../controllers/seed");
const ctrlPublic = require("../controllers/public");
const { tempUpload } = require("../middlewares/cloudinary");
const { validateJWT } = require("../middlewares/authenticated");
const router = Router();

//[ http://localhost:3000/api/seed ]
router.get("/", ctrlSeed.seed_data);
router.get("/get_company", ctrlSeed.get_company);
router.put("/update_company", [tempUpload], ctrlSeed.update_company);

router.get("/generate_token/:inscription/:customer", ctrlPublic.generate_token);
router.post("/send_survey", ctrlPublic.send_survey);
router.get("/read_survey/:id", ctrlPublic.read_survey);
router.get("/confirm_email_verify/:token", ctrlPublic.confirm_email_verify);

module.exports = router;
