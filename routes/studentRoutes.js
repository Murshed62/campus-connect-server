const multer = require("multer")();
const router = require("express").Router();
const authControllers = require("../controllers/authController");
const studentControllers = require("../controllers/studentController");

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.get("/logout", authControllers.logout);
// Make all the routes below this are protected
router.use(authControllers.protect);
router.patch("/:id", studentControllers.update);
router.patch(
  "/:id/avatar",
  multer.single("avatar"),
  studentControllers.uploadAvatar,
  studentControllers.update
);

module.exports = router;
