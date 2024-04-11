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
router.post("/addUser",Auth.verify("admin"),Controller.AdminController.addUser);
router.put("/editUser/:id",Auth.verify("admin"),Controller.AdminController.editUser);
router.get("/getUser/:id?",Auth.verify("admin"),Controller.AdminController.getUser);
router.delete("/deleteUser/:id",Auth.verify("admin"),Controller.AdminController.deleteUser);

// delete comment
router.delete("/deleteComment/:id",Auth.verify("admin"),Controller.AdminController.deleteComment);

// delete posts
router.delete("/deletePost/:id",Auth.verify("admin"),Controller.AdminController.deletePosts);

// subadmin
router.post("/addSubAdmin",Auth.verify("admin"),Controller.AdminController.addSubAdmin);

//category
router.post("/addCategory",Auth.verify("admin"),Controller.AdminController.addCategory);
router.put("/editCategory/:id",Auth.verify("admin"),Controller.AdminController.editCategory);
router.get("/getCategory/:id?",Auth.verify("admin"),Controller.AdminController.getCategory);
router.delete("/deleteCategory/:id",Auth.verify("admin"),Controller.AdminController.deleteCategory);

//subcategory
router.post("/addAnimalCategory",Auth.verify("admin"),Controller.AdminController.addAnimalCategory);
router.put("/editAnimalCategory/:id",Auth.verify("admin"),Controller.AdminController.editAnimalCategory);
router.get("/getAnimalCategory/:id?",Auth.verify("admin"),Controller.AdminController.getAnimalCategory);
router.delete("/deleteAnimalCategory/:id",Auth.verify("admin"),Controller.AdminController.deleteAnimalCategory);


// park 
router.post("/createPark",Auth.verify("admin"),Controller.AdminController.createPark);
router.put("/editPark/:id",Auth.verify("admin"),Controller.AdminController.updatePark);
router.delete("/deletePark/:id",Auth.verify("admin"),Controller.AdminController.deletePark);
router.get("/getPark/:id?",Auth.verify("admin"),Controller.AdminController.getPark);

// cms
router.post("/addCms",Auth.verify("admin"),Controller.AdminController.addCms);
router.get("/getCms",Auth.verify("admin"),Controller.AdminController.getCms);
// router.get("/getTermsAndConditions",Auth.verify("admin"),Controller.AdminController.getTermsAndConditions);


module.exports=router;



