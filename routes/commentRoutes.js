const router = require("express").Router();
const commentControllers = require("../controllers/commentController");
const { protect } = require("../controllers/authController");
router.use(protect);
router
  .route("/")
  .post(commentControllers.create)
  .get(commentControllers.getAll);
router
  .route("/:id")
  .patch(commentControllers.update)
  .delete(commentControllers.delete);
module.exports = router;
