const Controller = require('../controller');
const Auth = require("../../common/authenticate");
const router = require('express').Router();

// admin onboarding
router.post("/signup",Controller.AdminController.signup);
router.post("/login",Controller.AdminController.login);
router.get("/logout",Auth.verify("admin"),Controller.AdminController.logout);
router.get("/getProfile",Auth.verify("admin"),Controller.AdminController.getProfile);
router.put("/updateProfile",Auth.verify("admin"),Controller.AdminController.updateProfile);
router.post("/changePassword",Auth.verify("admin"),Controller.AdminController.changePassword);
router.post("/forgetPassword",Controller.AdminController.forgotPassword);
router.post("/verifyOtp",Controller.AdminController.verifyOtp);
router.post("/resetPassword",Auth.verify("admin"),Controller.AdminController.resetPassword);

module.exports=router;