const router = require("express").Router();
const likeControllers = require("../controllers/likeController");
const { protect } = require("../controllers/authController");

router.use(protect);
router.get("/", likeControllers.getAll);
router.patch("/toggle", likeControllers.toggleLike);

module.exports = router;
