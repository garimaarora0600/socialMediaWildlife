const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const constants=require("../common/constants");

const OtpSchema=new Schema({
    otp:{
        type:String,
        default:""
    },
    email:{
        type:String,
        default:"",
        index:true
    },
    phoneNo:{
        type:String,
        default:""
    },
    dialCode:{
        type:String,
        default:""
    },
    expiryAt:{
        type:Date,
        default:new Date()
    },
    userId:{
        type:ObjectId,
        ref:"Users",
        default:null,
        index:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});
OtpSchema.set("toJSON",{
    virtuals:true
});
module.exports = mongoose.model('Otp', OtpSchema);