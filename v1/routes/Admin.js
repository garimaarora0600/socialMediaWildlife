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


// delete user
router.delete("/deleteUser/:id",Auth.verify("admin"),Controller.AdminController.deleteUser);

// subadmin
router.post("/addSubAdmin",Auth.verify("admin"),Controller.AdminController.addSubAdmin);

//category
router.post("/addCategory",Auth.verify("admin"),Controller.AdminController.addCategory);
router.put("/editCategory",Auth.verify("admin"),Controller.AdminController.editCategory);
router.get("/getCategory",Auth.verify("admin"),Controller.AdminController.getCategory);
router.delete("/deleteCategory",Auth.verify("admin"),Controller.AdminController.deleteCategory);

//subcategory
router.post("/addSubCategory",Auth.verify("admin"),Controller.AdminController.addCategory);
router.put("/editSubCategory",Auth.verify("admin"),Controller.AdminController.editCategory);
router.get("/getSubCategory",Auth.verify("admin"),Controller.AdminController.getCategory);
router.delete("/deleteSubCategory",Auth.verify("admin"),Controller.AdminController.deleteCategory);




module.exports=router;



