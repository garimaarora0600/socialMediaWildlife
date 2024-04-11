const Model = require("../../../models/index");
const Validation = require("../../validations");
const Auth = require("../../../common/authenticate");
const constants = require("../../../common/constants");
const functions = require("../../../common/functions");
const services = require("../../../services");
const mongoose = require("mongoose");
const ObjectId =mongoose.Types.ObjectId;

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
        console.log("req.admin ", req.admin);
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
        return res.success(constants.MESSAGES.LOGOUT_SUCCESS, {});
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
            isDeleted: false
        });
        if (!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let checkOtp = await Model.Otp.findOne({
            email: (req.body.email).toLowerCase(),
            otp: req.body.otp
        });
        console.log("checkOtp", checkOtp);
        if (!checkOtp) throw new Error(constants.MESSAGES.OTP_INVALID);
        let jti = functions.generateRandomStringAndNumbers(25);
        await Model.Admin.updateOne({
            _id: check._id
        }, {
            $set: {
                jti: jti,
                isEmailVerified: true
            }
        });
        check = JSON.parse(JSON.stringify(check));
        check.accessToken = Auth.getToken({
            _id: check._id,
            jti: jti,
            role: "admin"
        });
        delete check.password;
        return res.success(constants.MESSAGES.VERIFICATION_SUCCESS, check);
    } catch (error) {
        next(error);
    }
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        await Validation.Admin.resetPassword.validateAsync(req.body);
        let check = await Model.Admin.findOne({
            _id: req.admin._id,
            isDeleted: false
        });
        if (!check) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
        let matchPwd = await functions.comparePasswordUsingBcrypt(req.body.newPassword, check.password);
        if (matchPwd) throw new Error(constants.MESSAGES.PASSWORD_SHOULD_BE_DIFF);
        check.password = await functions.hashPasswordUsingBcrypt(req.body.newPassword);
        await check.save();
        return res.success(constants.MESSAGES.RESET_PWD_SUCCESS, {});
    } catch (error) {
        next(error);
    }
};

module.exports.addUser = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.USER;
        req.query.apiType = "add";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Validation.Admin.addUser.validateAsync(req.body);
            if (req.body.phoneNo) {
                let checkPhone = await Model.User.findOne({
                    dialCode: req.body.dialCode,
                    phoneNo: req.body.phoneNo,
                    isDeleted: false
                }, {
                    password: 0
                });
                if (checkPhone) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
            }
            if (req.body.email) {
                let checkEmail = await Model.User.findOne({
                    email: (req.body.email).toLowerCase(),
                    isDeleted: false,
                    isEmailVerified: true
                }, {
                    password: 0
                });
                if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
                else {
                    await Model.User.deleteMany({
                        email: (req.body.email).toLowerCase(),
                        isDeleted: false,
                        isEmailVerified: false
                    });
                }
            }
            let addUser = await Model.User.create(req.body);
            return res.success(constants.MESSAGES.PROFILE_CREATED_SUCCESSFULLY, addUser);
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.deleteUser = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.USER;
        req.query.apiType = "delete";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Model.User.findOneAndUpdate({
                _id: ObjectId(req.params.id),
                isDeleted: false
            }, {
                $set: {
                    isDeleted: true
                }
            });
            return res.success(constants.MESSAGES.PROFILE_DELETED_SUCCESSFULLY, {});
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.editUser = async (req, res, next)=> {
    try {
        req.query.sideBarId = constants.MODULES.USER;
        req.query.apiType = "add";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Validation.Admin.addUser.validateAsync(req.body);
            if (req.body.phoneNo) {
                let checkPhone = await Model.User.findOne({
                    _id: {
                        $ne: ObjectId(req.params.id)
                    },
                    dialCode: req.body.dialCode,
                    phoneNo: req.body.phoneNo,
                    isDeleted: false
                }, {
                    password: 0
                });
                if (checkPhone) throw new Error(constants.MESSAGES.PHONE_ALREADY_EXISTS);
            }
            if (req.body.email) {
                let checkEmail = await Model.User.findOne({
                    _id: {
                        $ne: ObjectId(req.params.id)
                    },
                    email: (req.body.email).toLowerCase(),
                    isDeleted: false,
                    isEmailVerified: true
                }, {
                    password: 0
                });
                if (checkEmail) throw new Error(constants.MESSAGES.EMAIL_ALREADY_EXISTS);
                else {
                    await Model.User.deleteMany({
                        email: (req.body.email).toLowerCase(),
                        isDeleted: false,
                        isEmailVerified: false
                    });
                }
            }
            let editUser = await Model.User.findOneAndUpdate({
                _id: ObjectId(req.params.id),
                isDeleted: false
            }, {
                $set: req.body
            }, {
                new: true
            });
            return res.success(constants.MESSAGES.PROFILE_UPDATED_SUCCESSFULLY, editUser);
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.getUser = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.USER;
        req.query.apiType = "get";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            if (req.params.id) {
                let user = await Model.User.findOne({
                    _id: ObjectId(req.params.id),
                    isDeleted: false
                });
                if (!user) throw new Error(constants.MESSAGES.ACCOUNT_NOT_FOUND);
                return res.success(constants.MESSAGES.DATA_FETCHED, user);
            } else {
                let page = null;
                let limit = null;
                page = req.query.page ? Number(req.query.page) : 1;
                limit = req.query.limit ? Number(req.query.limit) : 10;
                let skip = Number((page - 1) * limit);
                let qry = {};
                if (req.query.search) {
                    const regex = new RegExp(req.query.search, "i");
                    qry._search = regex;
                }
                let criteria = {
                    isDeleted: false,
                    isProfileCompleted: true
                };
                let pipeline = [];
                pipeline.push({
                    $match: criteria
                }, {
                    $addFields: {
                        _search: {
                            $concat: ["$firstName", "$lastName", "$email", "$phoneNo"]
                        }
                    }
                }, {
                    $sort: {
                        createdAt: -1
                    }
                }, {
                    $skip: skip
                }, {
                    $limit: limit
                });
                let user = await Model.User.aggregate(pipeline);
                pipeline = pipeline.splice(0, pipeline.length - 3);
                let totalCount = await Model.User.aggregate(pipeline);
                let data = {
                    user,
                    totalCount
                };
                return res.success(constants.MESSAGES.DATA_FETCHED, data);
            }
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.deleteUser = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.USER;
        req.query.apiType = "delete";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Model.User.findOneAndUpdate({
                _id: ObjectId(req.params.id),
                isDeleted: false
            }, {
                $set: {
                    isDeleted: true
                }
            });
            return res.success(constants.MESSAGES.PROFILE_DELETED_SUCCESSFULLY, {});
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.deleteComment = async (req, res, next) => {
    try {
        await Model.Comments.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false
        }, {
            $set: {
                isDeleted: true
            }
        }, {
            new: true
        });
        return res.success(constants.MESSAGES.COMMENT_DELETED_SUCCESSFULLY, {});
    } catch (error) {
        next(error);
    }
};
module.exports.deletePosts = async (req, res, next) => {
    try {
        await Model.Posts.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false
        }, {
            $set: {
                isDeleted: true,
                status: constants.POST_STATUS.REJECTED
            }
        });
        return res.success(constants.MESSAGES.POST_DELETED_SUCCESSFULLY, {});
    } catch (error) {
        next(error);
    }
};

// add category
module.exports.addCategory = async (req, res, next) => {
    try {
        await Validation.Admin.addCategory.validateAsync(req.body);
        let name = (req.body.name);
        let nameRegExp = new RegExp('^' + name + '$', 'i');
        let check = await Model.Category.findOne({
            name: nameRegExp,
            isDeleted: false
        });
        if (check) throw new Error(constants.MESSAGES.CATEGORY_NAME_ALREADY_EXISTS);
        req.body.categoryType = constants.CATEGORY_TYPE.CATEGORY;
        let create = await Model.Category.create(req.body);
        return res.success(constants.MESSAGES.CATEGORY_ADDED_SUCCESSFULLY, create);
    } catch (error) {
        next(error);
    }
};
module.exports.editCategory = async (req, res, next) => {
    try {
        await Validation.Admin.editCategory.validateAsync(req.body);
        let check = await Model.Category.findOne({
            _id: ObjectId(req.params.id),
            isDeleted: false,
            categoryType: constants.CATEGORY_TYPE.CATEGORY
        });
        if (!check) throw new Error(constants.MESSAGES.CATEGORY_NOT_EXISTS);
        if (req.body.name) {
            let name = req.body.name;
            let nameRegExp = new RegExp('^' + name + '$', 'i');
            let checkName = await Model.Category.findOne({
                _id: {
                    $ne: ObjectId(req.params.id)
                },
                name: nameRegExp,
                isDeleted: false
            });
            if (checkName) throw new Error(constants.MESSAGES.CATEGORY_NAME_ALREADY_EXISTS);
        }
        let update = await Model.Category.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false
        }, {
            $set: req.body
        }, {
            new: true
        });
        return res.success(constants.MESSAGES.CATEGORY_UPDATED_SUCCESSFULLY, update);
    } catch (error) {
        next(error);
    }
};
module.exports.getCategory = async (req, res, next) => {
    try {
        let category;
        if (req.params.id) {
            category = await Model.Category.findOne({
                _id: ObjectId(req.params.id),
                isDeleted: false
            });
            if (!category) throw new Error(constants.MESSAGES.CATEGORY_NOT_EXISTS);
        } else {
            let page = null;
            let limit = null;
            page = req.query.page ? Number(req.query.page) : 1;
            limit = req.query.limit ? Number(req.query.limit) : 10;
            let skip = Number((page - 1) * limit);
            let qry = {};
            if (req.query.search) {
                const regex = new RegExp(req.query.search, "i");
                qry._search = regex;
            }
            let pipeline = [];
            pipeline.push({
                $match: {
                    categoryType: constants.CATEGORY_TYPE.CATEGORY,
                    isDeleted: false
                }
            }, {
                $addFields: {
                    _search: {
                        $concat: ["$name"]
                    }
                }
            }, {
                $match: qry
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $skip: skip
            }, {
                $limit: limit
            });
            let categories = await Model.Category.aggregate(pipeline);
            pipeline = pipeline.splice(0, pipeline.length - 3);
            let totalCategory = await Model.Category.aggregate(pipeline);
            let totalCategories=totalCategory.length;
            category = {
                categories,
                totalCategories
            };
        }
        return res.success(constants.MESSAGES.DATA_FETCHED, category);
    } catch (error) {
        next(error);
    }
};
module.exports.deleteCategory = async (req, res, next) => {
    try {
        await Model.Category.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false,
            categoryType: constants.CATEGORY_TYPE.CATEGORY
        }, {
            $set: {
                isDeleted: true
            }
        }, {
            new: true
        });
        return res.success(constants.MESSAGES.CATEGORY_DELETED_SUCCESSFULLY, {});
    } catch (error) {
        next(error);
    }
};
module.exports.addAnimalCategory = async (req, res, next) => {
    try {
        await Validation.Admin.addSubCategory.validateAsync(req.body);
        let name = req.body.name;
        let nameRegExp = new RegExp('^' + name + '$', 'i');
        let category = await Model.Category.findOne({
            name: nameRegExp,
            isDeleted: false,
            categoryType: constants.CATEGORY_TYPE.SUBCATEGORY,
            label: req.body.label
        });
        if (category) throw new Error(constants.MESSAGES.SUBCATEGORY_EXISTS);
        req.body.categoryType = constants.CATEGORY_TYPE.SUBCATEGORY;
        let create = await Model.Category.create(req.body);
        return res.success(constants.MESSAGES.SUBCATEGORY_ADDED_SUCCESSFULLY, create);
    } catch (error) {
        next(error);
    }
};
module.exports.editAnimalCategory = async (req, res, next) => {
    try {
        await Validation.Admin.editCategory.validateAsync(req.body);
        let check = await Model.Category.findOne({
            _id: ObjectId(req.params.id),
            isDeleted: false,
            categoryType: constants.CATEGORY_TYPE.SUBCATEGORY
        });
        if (!check) throw new Error(constants.MESSAGES.CATEGORY_NOT_EXISTS);
        if (req.body.name) {
            let name = req.body.name;
            let nameRegExp = new RegExp('^' + name + '$', 'i');
            let checkName = await Model.Category.findOne({
                _id: {
                    $ne: ObjectId(req.params.id)
                },
                name: nameRegExp,
                isDeleted: false
            });
            if (checkName) throw new Error(constants.MESSAGES.SUBCATEGORY_NAME_ALREADY_EXISTS);
        }
        let update = await Model.Category.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false
        }, {
            $set: req.body
        }, {
            new: true
        });
        return res.success(constants.MESSAGES.SUBCATEGORY_UPDATED_SUCCESSFULLY, update);
    } catch (error) {
        next(error);
    }
};
module.exports.getAnimalCategory = async (req, res, next) => {
    try {
        let category;
        if (req.params.id) {
            category = await Model.Category.findOne({
                _id: ObjectId(req.params.id),
                isDeleted: false,
                categoryType: constants.CATEGORY_TYPE.SUBCATEGORY
            });
            if (!category) throw new Error(constants.MESSAGES.CATEGORY_NOT_EXISTS);
        } else {
            let page = null;
            let limit = null;
            page = req.query.page ? Number(req.query.page) : 1;
            limit = req.query.limit ? Number(req.query.limit) : 10;
            let skip = Number((page - 1) * limit);
            let qry = {};
            // if (!req.query.parentId) throw new Error(constants.MESSAGES.PARENT_ID_NOT_FOUND);
            if (req.query.search) {
                const regex = new RegExp(req.query.search, "i");
                qry._search = regex;
            }
            if(req.query.parentId){
                qry.parentId=req.query.parentId;
            }
            let pipeline = [];
            pipeline.push({
                $match: {
                    // parentId: ObjectId(req.query.parentId),
                    categoryType: constants.CATEGORY_TYPE.SUBCATEGORY,
                    isDeleted: false
                }
            }, {
                $addFields: {
                    _search: {
                        $concat: ["$name"]
                    }
                }
            }, {
                $match: qry
            }, {
                $sort: {
                    createdAt: -1
                }
            }, {
                $skip: skip
            }, {
                $limit: limit
            });
            let categories = await Model.Category.aggregate(pipeline);
            pipeline = pipeline.splice(0, pipeline.length - 3);
            let totalCategory = await Model.Category.aggregate(pipeline);
            let totalCategories=totalCategory.length;
            category = {
                categories,
                totalCategories
            };
        }
        return res.success(constants.MESSAGES.DATA_FETCHED, category);
    } catch (error) {
        next(error);
    }
};
module.exports.deleteAnimalCategory = async (req, res, next) => {
    try {
        await Model.Category.findOneAndUpdate({
            _id: ObjectId(req.params.id),
            isDeleted: false,
            categoryType: constants.CATEGORY_TYPE.SUBCATEGORY
        }, {
            $set: {
                isDeleted: true
            }
        }, {
            new: true
        });
        return res.success(constants.MESSAGES.SUBCATEGORY_DELETED_SUCCESSFULLY, {});
    } catch (error) {
        next(error);
    }
};
module.exports.createPark = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.PARK;
        req.query.apiType = "add";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Validation.Admin.createPark.validateAsync(req.body);
            let name = req.body.name;
            let nameRegExp = new RegExp('^' + name + '$', 'i');
            let check = await Model.Park.findOne({
                name: nameRegExp,
                isDeleted: false
            });
            if (check) throw new Error(constants.MESSAGES.PARK_NAME_ALREADY_EXISTS)
            let create=await Model.Park.create(req.body);
        return res.success(constants.MESSAGES.PARK_ADDED_SUCCESSFULLY,create);
        }
    throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.deletePark=async(req,res,next)=>{
    try{
        req.query.sideBarId = constants.MODULES.PARK;
        req.query.apiType = "delete"
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if (isAccess) {
            await Model.Park.findOneAndUpdate({
                _id:ObjectId(req.params.id),
                isDeleted:false
            },{
                $set:{
                    isDeleted:true
                }
            });
            return res.success(constants.MESSAGES.PARK_DELETED_SUCCESSFULLY,{});
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    }catch(error){
        next(error);
    }
};
module.exports.updatePark=async(req,res,next)=>{
    try{
        req.query.sideBarId = constants.MODULES.PARK;
        req.query.apiType = "add";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if(isAccess){
            await Validation.Admin.editPark.validateAsync(req.body);
            let name = req.body.name;
            let nameRegExp = new RegExp('^' + name + '$', 'i');
            let check = await Model.Park.findOne({
                _id: {
                    $ne: ObjectId(req.params.id)
                },
                name: nameRegExp,
                isDeleted: false
            });
            if (check) throw new Error(constants.MESSAGES.PARK_NAME_ALREADY_EXISTS);
            let update=await Model.Park.findOneAndUpdate({
                _id:ObjectId(req.params.id),
                isDeleted:false
            },{
                $set:req.body
            },{
                new:true
            });
            return res.success(constants.MESSAGES.PARK_UPDATED_SUCCESSFULLY,update);
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    }catch(error){
        next(error);
    }
}
module.exports.getPark=async(req,res,next)=>{
    try{
        req.query.sideBarId = constants.MODULES.PARK;
        req.query.apiType = "get";
        let isAccess = await services.SubAdmin.checkSubAdmin(req);
        if(isAccess){
            if(req.params.id){
                let data=await Model.Park.findOne({
                    _id:ObjectId(req.params.id),
                    isDeleted:false
                });
                if(!data) throw new Error(constants.MESSAGES.PARK_NOT_FOUND);
                return res.success(constants.MESSAGES.DATA_FETCHED,data);
            }else{
            let page = null;
            let limit = null;
            page = req.query.page ? Number(req.query.page) : 1;
            limit = req.query.limit ? Number(req.query.limit) : 10;
            let skip = Number((page - 1) * limit);
            let qry={};
            if(req.query.search){
                const regex = new RegExp(req.query.search, "i");
                qry._search = regex;
            }
            let pipeline=[];
            pipeline.push({
                $match:{
                    isDeleted:false
                }
            },{
                $addFields:{
                    _search:{
                        $concat:["$name"]
                    }
                }
            },{
                $match:qry
            },{
                $sort:{
                    createdAt:-1
                }
            },{
                $skip:skip
            },{
                $limit:limit
            });
            let park=await Model.Park.aggregate(pipeline);
            pipeline=pipeline.splice(0,pipeline.length-3);
            let totalCount=await Model.Park.aggregate(pipeline);
            let totalParks=totalCount.length;
            let data={park,totalParks};
            return res.success(constants.MESSAGES.DATA_FETCHED,data);
            }
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    }catch(error){
        next(error);
    }
}

// CMS
module.exports.addCms = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.CMS;
        req.query.apiType = "add";
        let isAccess = await subAdmin.checkSubAdmin(req);

        if (isAccess) {
            await Validation.Admin.addCms.validateAsync(req.body);
            //Add Cms pages data
            let dataObject = {};
            if (req.body.privacyPolicy != null && req.body.privacyPolicy != "") dataObject.privacyPolicy = req.body.privacyPolicy;
            if (req.body.termsAndConditions != null && req.body.termsAndConditions != "") dataObject.termsAndConditions = req.body.termsAndConditions;
            if (req.body.customerPolicy != null && req.body.customerPolicy != "") dataObject.customerPolicy = req.body.customerPolicy;
            if (req.body.deletionPolicy != null && req.body.deletionPolicy != "") dataObject.deletionPolicy = req.body.deletionPolicy;
            if (req.body.aboutUs != null && req.body.aboutUs != "") dataObject.aboutUs = req.body.aboutUs;
            if (req.body.supportPolicy != null && req.body.supportPolicy != "") dataObject.supportPolicy = req.body.supportPolicy;
            const addCms = await Model.Cms.findOneAndUpdate({}, dataObject, {
                upsert: true,
                new: true
            });
            return res.success(constants.MESSAGES.SUCCESS, addCms);
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};
module.exports.getCms = async (req, res, next) => {
    try {
        req.query.sideBarId = constants.MODULES.CMS;
        req.query.apiType = "get";
        let isAccess = await subAdmin.checkSubAdmin(req);
        if (isAccess) {
        //Fetch data without permission because cms pages need to be build for the app/web.
        const cmsData = await Model.CMS.findOne({});
        return res.success(constants.MESSAGES[lang].DATA_FETCHED, cmsData);
        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    } catch (error) {
        next(error);
    }
};


// subadmin
module.exports.addSubAdmin=async(req,res,next)=>{
    try{
        req.query.sideBarId=constants.MODULES.ADMIN;
        req.query.apiType="add";
        let isAccess=await services.SubAdmin.checkSubAdmin(req);
        if(isAccess){

        }
        throw new Error(constants.MESSAGES.ACCESS_DENIED);
    }catch(error){
        next(error);
    }
}