const router = require("express").Router();
const conversationControllers = require("../controllers/conversationController");
const { protect } = require("../controllers/authController");

router.use(protect);
router.get("/", conversationControllers.getOne);

module.exports = router;
