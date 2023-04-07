const router = require("express").Router();
const rollControllers = require("../controllers/rollControllers");

router.route("/").post(rollControllers.create);

module.exports = router;
