const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constants = require("../common/constants")
const UserSchema = new Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: "",
        index: true
    },
    gender: {
        type: String,
        enum: Object.values(constants.GENDER)
    },
    phoneNo: {
        type: String,
        default: ""
    },
    dialCode: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    username:{
        type:String,
        lowercase:true,
        default:""
    },
    description: {
        type: String,
        default: ""
    },
    DOB: {
        type: Date,
        default: ""
    },
    country:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    interests:[{
        type:String,
        default:""
    }],
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    isSocialLogin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    appleId: {
        type: String,
        default: "",
        index: true
    },
    googleId: {
        type: String,
        default: "",
        index: true
    },
    facebookId: {
        type: String,
        default: "",
        index: true
    },
    loginCount: {
        type: Number,
        default: 0
    },
    jti: {
        type: String,
        default: "",
        select: false,
        index: true
    },
    deviceType: {
        type: String,
        enum: Object.values(constants.DEVICETYPE),
        default: constants.DEVICETYPE.IOS
    },
    deviceToken: {
        type: String,
        default: "",
        index: true
    },
    location: {
        type: {
          type: String,
          default: "Point"
        },
        coordinates: {
          type: [Number],
          default: [0, 0]
        }
    },
    manageNotifications:{
    allNotifications:{
        type:Boolean,
        default:false
    },
    parkNotification:{
        type:Boolean,
        default:false
    },
    like:{
        type:Boolean,
        default:false
    },
    comment:{
        type:Boolean,
        default:false
    },
    postAccepted:{
        type:Boolean,
        default:false
    },
    postRejected:{
        type:Boolean,
        default:false
    }            
    }
}, {
    timestamps: true
});
UserSchema.set("toJSON", {
    virtuals: true
});
module.exports = mongoose.model('Users', UserSchema);