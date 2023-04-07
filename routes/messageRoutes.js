const router = require("express").Router();
const messageControllers = require("../controllers/messageController");
const { protect } = require("../controllers/authController");
router.use(protect);
router
  .route("/")
  .post(messageControllers.create)
  .get(messageControllers.getAll);
router
  .route("/:id")
  .patch(messageControllers.update)
  .delete(messageControllers.delete);

module.exports = router;
