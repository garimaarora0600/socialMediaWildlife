const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constants=require("../common/constants");
const AdminSchema=new Schema({
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:"",
        lowercase:true,
        index:true
    },
    phoneNo:{
        type:String,
        default:"",
        index:true
    },
    role: {
        type: Number,
        enum: [constants.ROLE.ADMIN, constants.ROLE.SUBADMIN],
        default: constants.ROLE.SUBADMIN
    },
    dialCode:{
        type:String,
        default:"",
        index:true
    },
    password:{
        type:String,
        default:"",
        index:true
    },
    image:{
        type:String,
        default:""
    },
    loginCount: {
        type: Number,
        default: 0
    },
    jti: {
        type: String,
        default: "",
        index: true
    },
    DOB:{
        type:Date,
        default:""
    },
    isPhoneVerified:{
        type:Boolean,
        default:false
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false,
        index:true
    },
    deviceType: {
        type: String,
        enum: Object.values(constants.DEVICETYPE),
        default:constants.DEVICETYPE.IOS
      },
      deviceToken: {
        type: String,
        default: "",
        index: true
      },
      accessRole: {
        type: ObjectId,
        ref: "AccessRole",
        default: null
    }
},{
    timestamps:true
});
AdminSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Admin', AdminSchema);