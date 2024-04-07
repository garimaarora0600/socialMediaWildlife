const Model = require("../../../models/index");
const Validation = require("../../validations");
const Auth = require("../../../common/authenticate");
const constants = require("../../../common/constants");
const functions = require("../../../common/functions");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const services=require("../../../services");
module.exports.signup = async (req, res, next) => {
    try {
        await Validation.User.signup.validateAsync(req.body);
        if (req.body.email) {
            const checkEmail = await Model.User.findOne({
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        if (req.body.phoneNo) {
            const checkPhone = await Model.User.findOne({
                phoneNo: (req.body.phoneNo).toLowerCase(),
                isDeleted: false
            });
            if (checkPhone) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
        }
        req.body.password = await functions.hashPasswordUsingBcrypt(req.body.password);
        let create = await Model.User.create(req.body);
        let payload={
            email:create.email,
            name:create.firstName?create.firstName:create.email,
            otp:functions.generateRandomNumbers(4)
        };
        await services.EmailService.sendEmailVerification(payload);
        return res.success(constants.MESSAGES.OTP_SENT, {});
    } catch (error) {
        next(error);
    }
};
module.exports.socialLogin=async(req,res,next)=>{
    try{
        await Validation.User.socialLogin.validateAsync(req.body);
        const socials=[];
        if(req.body.appleId){
            socials.push({
                appleId:req.body.appleId
            });
        }
        if(req.body.googleId){
            socials.push({
                googleId:req.body.googleId
            });
        }
        if(req.body.facebookId){
            socials.push({
                facebookId:req.body.facebookId
            });
        }
        if(!socials.length) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        // check if user has already created account with socials ids
        let user=await Model.User.findOne({
            $or:socials,
            isDeleted:false
        });
        let successMessage=1;
        // if no account is created, create a new account
        if(user==null || user==undefined){
            if(req.body.phoneNo){
                user=await Model.User.findOne({
                    dialCode:req.body.dialCode,
                    phoneNo:req.body.phoneNo,
                    isDeleted:false,
                    isProfileCompleted:true
                });
                if(user) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
                req.body.isPhoneVerified=true;
            }
            if(req.body.email){
                user=await Model.User.findOne({
                    email:(req.body.email).toLowerCase(),
                    isDeleted:false,
                    isProfileCompleted:true
                });
                if(user) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
                req.body.isEmailVerified=true;
            }
            req.body.isSocialLogin=true;
            user=await Model.User.create(req.body);
            successMessage=2;
        }
        user.deviceToken=req.body.deviceToken;
        user.deviceType=req.body.deviceType;
        user.loginCount+=1;
        // creating a jti 
        user.jti=functions.generateRandomStringAndNumbers(25);
        await user.save();
        user=JSON.parse(JSON.stringify(user));
        user.accessToken=Auth.getToken({
            _id:user._id,
            jti:user.jti,
            role:"user"
        });
        return res.success(successMessage==1?constants.MESSAGES.LOGIN_SUCCESS:constants.MESSAGES.PROFILE_CREATED_SUCCESSFULLY,user);
    }catch(error){
        next(error);
    }
};
module.exports.login = async (req, res, next) => {
    try {
        await Validation.User.login.validateAsync(req.body);
        if (req.body.email) {
            let check = await Model.User.findOne({
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (!check) throw new Error(constants.MESSAGES.INVALID_DETAILS);
            let matchPwd = await functions.comparePasswordUsingBcrypt(
                req.body.password,
                check.password
            );
            if (!matchPwd) throw new Error(constants.MESSAGES.PASSWORD_DOESNT_MATCH);
            check.loginCount += 1;
            check.jti = functions.generateRandomStringAndNumbers(25);
            await check.save();
            check = JSON.parse(JSON.stringify(check));
            check.accessToken = await Auth.getToken({
                _id: check._id,
                jti: check.jti,
                role: "user"
            });
            delete check.password;
            return res.success(constants.MESSAGES.LOGIN_SUCCESS, check);
        }
    } catch (error) {
        next(error);
    }
};

module.exports.logout = async (req, res, next) => {
    try {
        console.log("req.admin ",req.admin);
        await Model.Admin.findOneAndUpdate({
            _id: req.admin._id,
            isDeleted: false
        }, {
            $set: {
                deviceType: "",
                deviceToken: "",
                jti: ""
            }
        });
        return res.success(constants.MESSAGES.LOGOUT_SUCCESS,{});
    } catch (error) {
        next(error);
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        let check = await Model.User.findOne({
            _id: req.user._id,
            isDeleted: false
        });
        if (!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        return res.success(constants.MESSAGES.PROFILE_FOUND, check);
    } catch (error) {
        next(error);
    }
};

module.exports.updateProfile = async (req, res, next) => {
    try {
        await Validation.User.updateProfile.validateAsync(req.body);
        if (req.body.email) {
            let checkEmail = await Model.User.findOne({
                _id: {
                    $nin: [req.user._id]
                },
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        if(req.body.username){
            let checkUsername = await Model.User.findOne({
                _id: {
                    $nin: [req.user._id]
                },
                username: (req.body.username).toLowerCase(),
                isDeleted: false
            });
            if (checkUsername) throw new Error(constants.MESSAGES.USERNAME_ALREADY_EXISTS);
        }
        if (req.body.phoneNo) {
            let checkPhoneNo = await Model.User.findOne({
                _id: {
                    $nin: [req.user._id]
                },
                phoneNo: req.body.phoneNo,
                isDeleted: false
            });
            if (checkPhoneNo) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
        }
        req.body.isProfileCompleted=true;
        let updatee = await Model.User.findOneAndUpdate({
            _id: req.user._id,
            isDeleted: false
        }, {
            $set: req.body
        },{
            new:true
        });
        updatee = JSON.parse(JSON.stringify(updatee));
        delete updatee.password;
        return res.success(constants.MESSAGES.PROFILE_UPDATED_SUCCESSFULLY, updatee);
    } catch (error) {
        next(error);
    }
};

module.exports.changePassword = async (req, res, next) => {
    try {
        await Validation.User.changePassword.validateAsync(req.body);
        if (req.body.oldPassword == req.body.newPassword) throw new Error(constants.MESSAGES.PASSWORD_SHOULD_BE_DIFF);
        let check = await Model.User.findOne({
            _id: req.user._id,
            isDeleted: false
        });
        if (!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let matchPwd = await functions.comparePasswordUsingBcrypt(
            req.body.oldPassword,
            check.password
        );
        if (!matchPwd) throw new Error(constants.MESSAGES.PASSWORD_DOESNT_MATCH);
        check.password = await functions.hashPasswordUsingBcrypt(req.body.newPassword);
        await check.save();
        return res.success(constants.MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY, {});
    } catch (error) {
        next(error);
    }
};

module.exports.sendOtp = async (req, res, next) => {
    try {
        await Validation.User.forgotPassword.validateAsync(req.body);
        let check = await Model.User.findOne({
            email: (req.body.email).toLowerCase(),
            isDeleted: false
        });
        if (!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        // send otp
        let payload = {
            firstName: check.firstName ? check.firstName : check.email,
            email: check.email,
            otp: functions.generateRandomNumbers(4)
        };
        await services.EmailService.sendEmailVerification(payload);
        return res.success(constants.MESSAGES.OTP_SENT, {});
    } catch (error) {
        next(error);
    }
};

module.exports.verifyOtp = async (req, res, next) => {
    try {
        await Validation.User.verifyOtp.validateAsync(req.body);
        let check = await Model.User.findOne({
            email: (req.body.email).toLowerCase(),
            isDeleted:false
        });
        if(!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let checkOtp = await Model.Otp.findOne({
            email: (req.body.email).toLowerCase(),
            otp: req.body.otp
        });
        console.log("checkOtp",checkOtp);
        if (!checkOtp) throw new Error(constants.MESSAGES.OTP_INVALID);
            let jti = functions.generateRandomStringAndNumbers(25);
            await Model.User.findOneAndUpdate({
                _id: check._id
            },{
                $set:{
                    jti:jti,
                    isEmailVerified:true
                }
            },{new:true});
            check=JSON.parse(JSON.stringify(check));
            check.accessToken=Auth.getToken({
                _id:check._id,
                jti:jti,
                role:"user"
            });
            delete check.password;
        return res.success(constants.MESSAGES.VERIFICATION_SUCCESS,check);
    } catch (error) {
        next(error);
    }
};

module.exports.resetPassword=async(req,res,next)=>{
    try {
        await Validation.User.resetPassword.validateAsync(req.body);
        let check=await Model.User.findOne({
            _id:req.user._id,
            isDeleted:false
        });
        if(!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let matchPwd=await functions.comparePasswordUsingBcrypt(req.body.newPassword,check.password);
        if(matchPwd) throw  new Error(constants.MESSAGES.PASSWORD_SHOULD_BE_DIFF);
        console.log("new password", req.body.newPassword);
        check.password=await functions.hashPasswordUsingBcrypt(req.body.newPassword);
        await check.save();
        return res.success(constants.MESSAGES.RESET_PWD_SUCCESS,{});
    } catch (error) {
        next(error);
    }
};
module.exports.deleteProfile=async(req,res,next)=>{
    try{
        await Model.User.findOneAndUpdate({
            _id:req.user._id,
            isDeleted:false
        },{
            $set:{
                isDeleted:true
            }
        });
        return res.success(constants.MESSAGES.PROFILE_DELETED_SUCCESSFULLY,{});
    }catch(error){
        next(error);
    }
};
module.exports.addLikes=async(req,res,next)=>{
    try{
        await Validation.User.addLikes.validateAsync(req.body);
        let check=await Model.User.findOne({
            _id:req.user._id,
            isDeleted:false
        });
        if(!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        req.body.userId=req.user._id;
        let likes=await Model.Likes.create(req.body);
        return res.success(constants.MESSAGES.LIKES_ADDED_SUCCESSFULLY,likes);
    }catch(error){
        next(error);
    }
};
module.exports.deleteLikes=async(req,res,next)=>{
    try{
        await Model.Likes.findOneAndUpdate({
            _id:req.user._id,
            isDeleted:false
        },
        {
            $set:{
                isDeleted:true
            }
        });
        return res.success(constants.MESSAGES.LIKES_REMOVED_SUCCESSFULLY,{});
    }catch(error){
        next(error);
    }
};

module.exports.addPosts=async(req,res,next)=>{
    try{
        await Validation.User.addPosts.validateAsync(req.body);
        req.body.userId=req.user._id;
        let addPost=await Model.Posts.create(req.body);
        return res.success(constants.MESSAGES.POSTS_ADDED_SUCCESSFULLY,addPost);
    }catch(error){
        next(error);
    }
};
module.exports.deletePosts=async(req,res,next)=>{
    try{
        await Model.Posts.findOneAndUpdate({
            _id:ObjectId(req.params.id),
            isDeleted:false
        },{
            $set:{
                isDeleted:true
            }
        },{
            new:true
        });
        return res.success(constants.MESSAGES.POST_DELETED_SUCCESSFULLY,{});
    }catch(error){
        next(error);
    }
};
module.exports.getPosts=async(req,res,next)=>{
    try {
        let page = null;
        let limit = null;
        page = req.query.page ? Number(req.query.page) : 1;
        limit = req.query.limit ? Number(req.query.limit) : 10;
        let skip = Number((page - 1) * limit);
        let data;
        
        if(req.params.id){
            data=await Model.Posts.findOne({
                _id:Object(req.params.id),
                isDeleted:false
            });
            if(!data) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        }
        else{
            // if(req.query.search){
            //     const regex=new RegExp(req.query.search,"i");
            //     qry._search=regex;
            // }
            let pipeline=[];
            pipeline.push({
                $match:{
                    isDeleted:false
                }
            },{
               $sort:{
                createdat:-1
               } 
            },{
                $skip:skip
            },{
                $limit:limit
            });
            let posts=await Model.Posts.aggregate(pipeline);
            pipeline=pipeline.splice(0,pipeline.length-3);
            let totalPosts=await Model.Posts.aggregate(pipeline);
            data={posts,totalPosts};
        }
        return res.success(constants.MESSAGES.DATA_FETCHED,data);
    } catch (error) {
        next(error);
    }
};

module.exports.editPosts=async(req,res,next)=>{
    try{
        await Validation.User.editPosts.validateAsync(req.body);
        let checkPosts=await Model.Posts.findOne({
            _id:ObjectId(req.params.id),
            isDeleted:false
        });
        if(!checkPosts) throw new Error(constants.MESSAGES.POST_NOT_FOUND);
        let update=await Model.Posts.findOneAndUpdate({
            _id:ObjectId(req.params.id),
            isDeleted:false
        },{
            $set:req.body
        },{
            new:true
        })
        return res.success(constants.MESSAGES.POSTS_UPDATED_SUCCESSFULLY,update)
    }catch(error){
        next(error);
    }
}

//comments
module.exports.addComments=async(req,res,next)=>{
    try{
        await Validation.User.addComments.validateAsync(req.body);
        // check whether the post exists
        let checkPost=await Model.Posts.findOne({
            _id:ObjectId(req.body.postId),
            isDeleted:false
        });
        if(!checkPost) throw new Error(constants.MESSAGES.POST_NOT_FOUND);
        let create=await Model.Comments.create(req.body);
        return res.success(constants.MESSAGES.COMMENT_ADDED_SUCCESSFULLY,create);
    }catch(error){
        next(error);
    }
};
module.exports.deleteComment=async(req,res,next)=>{
    try {
        let check=await Model.Comments.findOne({
            _id:ObjectId(req.params.id),
            isDeleted:false
        });
        if(!check) throw new Error(constants.MESSAGES.COMMENT_NOT_FOUND);
        await Model.Comments.findOneAndUpdate({
            _id:ObjectId(req.params.id),
            isDeleted:false
        },{
            $set:{
                isDeleted:true
            }
        });
        return res.success(constants.MESSAGES.COMMENT_DELETED_SUCCESSFULLY,{});
    } catch (error) {
        next(error);
    }
};
module.exports.editComment=async(req,res,next)=>{
    try{
        await Validation.User.editComment.validateAsync(req.body);
        // check whether the post exist
        let checkPost=await Model.Posts.findOne({
            _id:ObjectId(req.body.postId),
            isDeleted:false
        });
        if(!checkPost) throw new Error(constants.MESSAGES.POST_NOT_FOUND);
        // check whether the comment exists
        let checkComment=await Model.Comments.findOne({
            _id:ObjectId(req.params.id),
            isDeleted:false
        });
        if(!checkComment) throw new Error(constants.MESSAGES.COMMENT_NOT_FOUND);
        let update=await Model.Comments.findOneAndUpdate({
            _id:ObjectId(req.params.id),
            isDeleted:false
        },{
            $set:req.body
        },{
            new:true
        });
        return res.success(constants.MESSAGES.COMMENT_UPDATED_SUCCESSFULLY,update);
    }catch(error){
        next(error);
    }
};
module.exports.getComments=async(req,res,next)=>{
    try {
        let page = null;
        let limit = null;
        page = req.query.page ? Number(req.query.page) : 1;
        limit = req.query.limit ? Number(req.query.limit) : 10;
        let skip = Number((page - 1) * limit);
        let data;
        
        if(req.params.id){
            data=await Model.Comments.findOne({
                _id:Object(req.params.id),
                isDeleted:false
            });
            if(!data) throw new Error(constants.MESSAGES.COMMENT_NOT_FOUND);
        }
        else{
            // if(req.query.search){
            //     const regex=new RegExp(req.query.search,"i");
            //     qry._search=regex;
            // }
            let pipeline=[];
            pipeline.push({
                $match:{
                    isDeleted:false,
                    postId:ObjectId(req.query.postId)
                }
            },{
               $sort:{
                createdat:-1
               } 
            },{
                $skip:skip
            },{
                $limit:limit
            });
            let posts=await Model.Comments.aggregate(pipeline);
            pipeline=pipeline.splice(0,pipeline.length-3);
            let totalPosts=await Model.Posts.aggregate(pipeline);
            data={posts,totalPosts};
        }
        return res.success(constants.MESSAGES.DATA_FETCHED,data);
    } catch (error) {
        next(error);
    }
};