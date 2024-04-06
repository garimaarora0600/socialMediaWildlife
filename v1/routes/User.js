const Controller = require('../controller');
const Auth = require("../../common/authenticate");
const router = require('express').Router();

// user onboarding
router.post("/signup",Controller.UserController.signup);
router.post("/verifyOtp",Controller.UserController.verifyOtp);
router.post("/login",Controller.UserController.login);
router.post("/socialLogin",Controller.UserController.socialLogin);
router.post("/forgetPassword",Controller.UserController.sendOtp);
router.post("/resetPassword",Auth.verify("user"),Controller.UserController.resetPassword);
router.put("/updateProfile",Auth.verify("user"),Controller.UserController.updateProfile);
router.post("/changePassword",Auth.verify("user"),Controller.UserController.changePassword);
router.delete("/deleteProfile",Auth.verify("user"),Controller.UserController.deleteProfile);
router.get("/getProfile",Auth.verify("user"),Controller.UserController.getProfile);
module.exports=router;