const Model = require("../../../models/index");
const Validation = require("../../validations");
const Auth = require("../../../common/authenticate");
const constants = require("../../../common/constants");
const functions = require("../../../common/functions");
const services = require("../../../services");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports.signup = async (req, res, next) => {
    try {
        await Validation.Admin.signup.validateAsync(req.body);
        if (req.body.email) {
            const checkEmail = await Model.Admin.findOne({
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        req.body.role = constants.ROLE.ADMIN;
        req.body.password = await functions.hashPasswordUsingBcrypt(req.body.password);
        let create = await Model.Admin.create(req.body);
        create = JSON.parse(JSON.stringify(create));
        delete create.password;
        return res.success(constants.MESSAGES.PROFILE_CREATED_SUCCESSFULLY, create);
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        await Validation.Admin.login.validateAsync(req.body);
        if (req.body.email) {
            let check = await Model.Admin.findOne({
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
                role: "admin"
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
        let check = await Model.Admin.findOne({
            _id: req.admin._id,
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
        await Validation.Admin.updateProfile.validateAsync(req.body);
        if (req.body.email) {
            let checkEmail = await Model.Admin.findOne({
                _id: {
                    $nin: [req.admin._id]
                },
                email: (req.body.email).toLowerCase(),
                isDeleted: false
            });
            if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
        }
        if (req.body.phoneNo) {
            let checkPhoneNo = await Model.Admin.findOne({
                _id: {
                    $nin: [req.admin._id]
                },
                phoneNo: req.body.phoneNo,
                isDeleted: false
            });
            if (checkPhoneNo) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
        }
        let updatee = await Model.Admin.findByIdAndUpdate({
            _id: req.admin._id,
            isDeleted: false
        }, {
            $set: req.body
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
        await Validation.Admin.changePassword.validateAsync(req.body);
        if (req.body.oldPassword == req.body.newPassword) throw new Error(constants.MESSAGES.PASSWORD_SHOULD_BE_DIFF);
        let check = await Model.Admin.findOne({
            _id: req.admin._id,
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

module.exports.forgotPassword = async (req, res, next) => {
    try {
        await Validation.Admin.forgotPassword.validateAsync(req.body);
        let check = await Model.Admin.findOne({
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
        await Validation.Admin.verifyOtp.validateAsync(req.body);
        let check = await Model.Admin.findOne({
            email: req.body.email,
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
            await Model.Admin.updateOne({
                _id: check._id
            },{
                $set:{
                    jti:jti,
                    isEmailVerified:true
                }
            });
            check=JSON.parse(JSON.stringify(check));
            check.accessToken=Auth.getToken({
                _id:check._id,
                jti:jti,
                role:"admin"
            });
            delete check.password;
        return res.success(constants.MESSAGES.VERIFICATION_SUCCESS,check);
    } catch (error) {
        next(error);
    }
};

module.exports.resetPassword=async(req,res,next)=>{
    try {
        await Validation.Admin.resetPassword.validateAsync(req.body);
        let check=await Model.Admin.findOne({
            _id:req.admin._id,
            isDeleted:false
        });
        if(!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let matchPwd=await functions.comparePasswordUsingBcrypt(req.body.newPassword,check.password);
        if(matchPwd) throw  new Error(constants.MESSAGES.PASSWORD_SHOULD_BE_DIFF);
        check.password=await functions.hashPasswordUsingBcrypt(req.body.newPassword);
        await check.save();
        return res.success(constants.MESSAGES.RESET_PWD_SUCCESS,{});
    } catch (error) {
        next(error);
    }
};