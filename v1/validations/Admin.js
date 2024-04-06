const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.identify = Joi.object({
    id: Joi.objectId().required()
});

module.exports.signup = Joi.object({
    email: Joi.string().email().required().error(new Error("Please Enter a valid email")),
    password: Joi.string().required(),
    firstName: Joi.string().optional(),
    lastName:Joi.string().optional(),
    dialCode: Joi.string().optional(),
    phoneNo: Joi.string().optional(),
    address: Joi.string().optional(),
    image: Joi.string().optional()
});

module.exports.login=Joi.object({
    email: Joi.string().email().required().error(new Error("Please Enter a valid email")),
    password: Joi.string().required()
});

module.exports.updateProfile=Joi.object({
    email: Joi.string().email().optional().error(new Error("Please Enter a valid email")),
    phoneNo: Joi.string().optional(),
    dialCode: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName:Joi.string().optional(),
    image: Joi.string().optional(),
    isBlocked: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional()
});
module.exports.changePassword=Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
});

module.exports.forgotPassword=Joi.object({
    email:Joi.string().email().required().error(new Error("Please Enter a valid email"))
});
module.exports.verifyOtp=Joi.object({
    email:Joi.string().email().required().error(new Error("Please Enter a valid email")),
    otp:Joi.string().required()
});
module.exports.resetPassword=Joi.object({
    newPassword:Joi.string().required()
});