const router = require("express").Router();
const AdminRoutes = require("./Admin");
const UserRoutes=require("./User");

router.use("/Admin", AdminRoutes);
router.use("/User", UserRoutes);

module.exports = router;