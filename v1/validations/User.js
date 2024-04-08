const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

module.exports.signup=Joi.object({
    email:Joi.string().email().required(),
    phoneNo:Joi.string().required(),
    dialCode:Joi.string().required(),
    password:Joi.string().required(),
    confirmPassword:Joi.ref("password")
});

module.exports.verifyOtp=Joi.object({
    email:Joi.string().email().required().error(new Error("Please Enter a valid email")),
    otp:Joi.string().required()
});
module.exports.changePassword=Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
});

module.exports.login=Joi.object({
    email: Joi.string().email().required().error(new Error("Please Enter a valid email")),
    password: Joi.string().required()
});

module.exports.socialLogin = Joi.object({
    appleId: Joi.string().optional().allow(""),
    googleId: Joi.string().optional().allow(""),
    facebookId: Joi.string().optional().allow(""),
    phoneNo: Joi.string().optional(),
    dialCode: Joi.string().optional(),
    DOB: Joi.date().optional(),
    email: Joi.string().email().optional().error(new Error("Please Enter a valid email")),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    gender: Joi.string().optional(),
    deviceToken: Joi.string().optional(),
    deviceType: Joi.string().optional(),
    image: Joi.string().optional()
});
module.exports.forgotPassword=Joi.object({
    email:Joi.string().email().required().error(new Error("Please Enter a valid email"))
});
module.exports.resetPassword=Joi.object({
    newPassword:Joi.string().required(),
    confirmNewPassword:Joi.ref("newPassword")
});

module.exports.updateProfile=Joi.object({
    email: Joi.string().email().optional().error(new Error("Please Enter a valid email")),
    phoneNo: Joi.string().optional(),
    dialCode: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName:Joi.string().optional(),
    DOB:Joi.date().optional(),
    image: Joi.string().optional(),
    isBlocked: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    country:Joi.string().optional(),
    state:Joi.string().optional(),
    city:Joi.string().optional(),
    description:Joi.string().optional(),
    username:Joi.string().optional()
});

module.exports.addLikes=Joi.object({
    like:Joi.number().required(),
    // userId:Joi.string().required(),
    postId:Joi.string().optional(),
    commentId:Joi.string().optional()
});

module.exports.addPosts=Joi.object({
    image:Joi.string().optional(),
    video:Joi.string().optional(),
    text:Joi.string().optional(),
    categoryId:Joi.string().optional(),
    subCategoryId:Joi.string().optional(),
    time:Joi.date().optional(),
    howManyYouSee:Joi.number().optional(),
    location:Joi.object({
        type:Joi.string().optional(),
        coordinates:Joi.array().optional()
    })
});
module.exports.addComments=Joi.object({
    comment:Joi.string().required(),
    postId:Joi.string().optional()
    // parentId:Joi.string().optional()
});

module.exports.updatePosts=Joi.object({
    text:Joi.string().optional(),
    image:Joi.string().optional(),
    video:Joi.string().optional()
});
module.exports.editComment=Joi.object({
    comment:Joi.string().optional()
});