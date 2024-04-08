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

router.get("/getParkList",Auth.verify("user"),Controller.UserController.getParkList);
router.get("/getAnimalList",Auth.verify("user"),Controller.UserController.getAnimalList);

// posts
router.post("/addPost",Auth.verify("user"),Controller.UserController.addPosts);
router.put("/editPost/:import ReactDOM from 'react-dom'",Auth.verify("user"),Controller.UserController.editPosts);
router.get("/getPosts",Auth.verify("user"),Controller.UserController.getPosts);
router.delete("/deletePost/:id",Auth.verify("user"),Controller.UserController.deletePosts);

// likes
router.post("/addLikes",Auth.verify("user"),Controller.UserController.addLikes);
router.delete("/deleteLikes/:id",Auth.verify("user"),Controller.UserController.deleteLikes);
router.get("/getAllLikes",Auth.verify("user"),Controller.UserController.getAllLikes);

// comments
router.post("/addComment",Auth.verify("user"),Controller.UserController.addComments);
router.put("/editComment/:id",Auth.verify("user"),Controller.UserController.editComment);
router.get("/getComment/:id?",Auth.verify("user"),Controller.UserController.getComments);
router.post("/deleteComment/:id",Auth.verify("user"),Controller.UserController.deleteComment);


// filter
router.post("/filterPark",Auth.verify("user"),Controller.UserController.filtersNationalPark);
router.post("/filterVisibility",Auth.verify("user"),Controller.UserController.filterVisibility);
router.post("/myTings",Auth.verify("user"),Controller.UserController.myTings);

module.exports=router;