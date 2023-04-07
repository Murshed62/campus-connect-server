const router = require("express").Router();
const multer = require("multer")();
const postControllers = require("../controllers/postController");
const { protect } = require("../controllers/authController");

router.use(protect);

router
  .route("/")
  .post(multer.array("images", 4), postControllers.create)
  .get(postControllers.getAll);

router
  .route("/:id")
  .get(postControllers.getOne)
  .patch(multer.array("images", 4), postControllers.update)
  .delete(postControllers.delete);
router.patch("/:id/remove-image", postControllers.removeImage);

module.exports = router;
